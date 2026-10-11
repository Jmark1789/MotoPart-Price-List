import { MotorPart } from '../types/motorPart';

export const SHEET_HEADERS = [
  'Part #',
  'Item Name',
  'Brand',
  'SRP Price',
  'Shop Price',
];

export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

export interface SpreadsheetMetadata {
  id: string;
  title: string;
  sheets: { id: number; title: string }[];
}

export async function fetchSpreadsheetMetadata(
  accessToken: string,
  spreadsheetId: string
): Promise<SpreadsheetMetadata> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId,properties.title,sheets(properties(sheetId,title))`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message ||
        `Failed to fetch spreadsheet (HTTP ${res.status}). Verify access permissions and Sheet ID.`
    );
  }

  const data = await res.json();
  return {
    id: data.spreadsheetId,
    title: data.properties?.title || 'Motor Parts Pricelist',
    sheets:
      data.sheets?.map((s: any) => ({
        id: s.properties?.sheetId,
        title: s.properties?.title,
      })) || [],
  };
}

export async function createMotorPartsSpreadsheet(
  accessToken: string,
  title: string = 'Motor Parts Pricelist',
  initialParts: MotorPart[] = []
): Promise<{ id: string; url: string; title: string }> {
  const sheetTitle = 'Pricelist';
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: sheetTitle,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errorBody = await createRes.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message || `Failed to create Google Sheet (HTTP ${createRes.status})`
    );
  }

  const created = await createRes.json();
  const spreadsheetId = created.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  const rows = [
    SHEET_HEADERS,
    ...initialParts.map((p) => [
      p.partNumber,
      p.itemName,
      p.brand,
      p.srpPrice,
      p.shopPrice,
    ]),
  ];

  await updateSpreadsheetValues(accessToken, spreadsheetId, sheetTitle, rows);

  // Apply styling to header row (slate background, white bold text)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: created.sheets?.[0]?.properties?.sheetId || 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.08, green: 0.12, blue: 0.18 }, // dark navy #141f2e
                  textFormat: {
                    foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                    bold: true,
                    fontSize: 11,
                  },
                  horizontalAlignment: 'LEFT',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: created.sheets?.[0]?.properties?.sheetId || 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 5,
              },
            },
          },
        ],
      }),
    });
  } catch (err) {
    console.warn('Header styling batchUpdate error (non-fatal):', err);
  }

  return {
    id: spreadsheetId,
    url: spreadsheetUrl,
    title,
  };
}

export async function updateSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  rows: (string | number)[][]
): Promise<void> {
  // Clear existing cells in sheet first to avoid ghost rows
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${encodeURIComponent(
      sheetName
    )}'!A1:Z5000:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${encodeURIComponent(
    sheetName
  )}'!A1?valueInputOption=USER_ENTERED`;

  const res = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: `'${sheetName}'!A1`,
      majorDimension: 'ROWS',
      values: rows,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message || `Failed to update spreadsheet values (HTTP ${res.status})`
    );
  }
}

export async function syncAllPartsToSheet(
  accessToken: string,
  spreadsheetId: string,
  parts: MotorPart[],
  sheetName?: string
): Promise<void> {
  let targetSheet = sheetName;
  if (!targetSheet) {
    try {
      const meta = await fetchSpreadsheetMetadata(accessToken, spreadsheetId);
      targetSheet = meta.sheets[0]?.title || 'Pricelist';
    } catch {
      targetSheet = 'Pricelist';
    }
  }

  const rows = [
    SHEET_HEADERS,
    ...parts.map((p) => [
      p.partNumber,
      p.itemName,
      p.brand,
      p.srpPrice,
      p.shopPrice,
    ]),
  ];

  await updateSpreadsheetValues(accessToken, spreadsheetId, targetSheet, rows);
}

export async function readPartsFromSheet(
  accessToken: string,
  spreadsheetId: string,
  sheetName?: string
): Promise<{ parts: MotorPart[]; sheetTitle: string }> {
  let targetSheet = sheetName;
  if (!targetSheet) {
    const meta = await fetchSpreadsheetMetadata(accessToken, spreadsheetId);
    targetSheet = meta.sheets[0]?.title || 'Pricelist';
  }

  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${encodeURIComponent(
    targetSheet
  )}'!A1:Z5000`;

  const res = await fetch(readUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message || `Failed to read spreadsheet values (HTTP ${res.status})`
    );
  }

  const data = await res.json();
  const rows: any[][] = data.values || [];

  if (rows.length === 0) {
    return { parts: [], sheetTitle: targetSheet };
  }

  const headerRow = rows[0].map((h: any) => String(h || '').trim().toLowerCase());

  // Find column indexes
  const colIndex = {
    partNumber: headerRow.findIndex((h) => h.includes('part') || h.includes('#') || h.includes('sku') || h.includes('code')),
    itemName: headerRow.findIndex((h) => h.includes('item') || h.includes('name') || h.includes('desc')),
    brand: headerRow.findIndex((h) => h.includes('brand') || h.includes('manuf') || h.includes('make')),
    srpPrice: headerRow.findIndex((h) => h.includes('srp') || h.includes('retail')),
    shopPrice: headerRow.findIndex((h) => h.includes('shop') || h.includes('whole') || h.includes('dealer') || h.includes('cost')),
  };

  const idxPartNumber = colIndex.partNumber !== -1 ? colIndex.partNumber : 0;
  const idxItemName = colIndex.itemName !== -1 ? colIndex.itemName : 1;
  const idxBrand = colIndex.brand !== -1 ? colIndex.brand : 2;
  const idxSrp = colIndex.srpPrice !== -1 ? colIndex.srpPrice : 3;
  const idxShop = colIndex.shopPrice !== -1 ? colIndex.shopPrice : 4;

  const parts: MotorPart[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || (!row[idxItemName] && !row[idxPartNumber])) continue;

    const rawSrp = String(row[idxSrp] || '0').replace(/[^0-9.-]+/g, '');
    const srpNum = parseFloat(rawSrp) || 0;

    const rawShop = String(row[idxShop] || '0').replace(/[^0-9.-]+/g, '');
    const shopNum = parseFloat(rawShop) || (srpNum ? Number((srpNum * 0.8).toFixed(2)) : 0);

    const partNumber = String(row[idxPartNumber] || `PT-${i}`).trim();
    const itemName = String(row[idxItemName] || '').trim();
    const brand = String(row[idxBrand] || 'Generic').trim();

    const part: MotorPart = {
      id: `part-${i}-${partNumber.replace(/\s+/g, '-')}`,
      partNumber,
      itemName,
      brand,
      srpPrice: srpNum,
      shopPrice: shopNum,
      updatedAt: new Date().toISOString(),
    };

    parts.push(part);
  }

  return { parts, sheetTitle: targetSheet };
}
