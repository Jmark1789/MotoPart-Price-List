export interface MotorPart {
  id: string;
  partNumber: string; // Part #
  itemName: string;   // Item Name
  brand: string;      // Brand
  srpPrice: number;   // SRP Price
  shopPrice: number;  // Shop Price
  updatedAt?: string;
}

export interface SheetSyncStatus {
  isConnected: boolean;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  spreadsheetTitle: string | null;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  autoSync: boolean;
  error: string | null;
}
