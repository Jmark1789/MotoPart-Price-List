import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { MotorPart } from '../types/motorPart';
import { formatPHP } from '../utils/formatCurrency';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  part: MotorPart | null;
  sheetConnected: boolean;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  part,
  sheetConnected,
  isDeleting,
}) => {
  if (!isOpen || !part) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-base sm:text-lg font-bold text-white">Delete Item from Pricelist?</h3>
          <p className="text-xs text-slate-400 mt-1">
            This will permanently remove the item from your pricelist.
          </p>

          <div className="mt-4 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {part.partNumber}
              </span>
              <span className="font-semibold text-slate-300">{part.brand}</span>
            </div>
            <div className="font-semibold text-slate-100 text-sm">{part.itemName}</div>
            <div className="text-slate-400 flex items-center space-x-3 pt-0.5">
              <span>SRP: <strong className="text-amber-400">{formatPHP(part.srpPrice)}</strong></span>
              <span>Shop: <strong className="text-emerald-400">{formatPHP(part.shopPrice)}</strong></span>
            </div>
          </div>

          {sheetConnected && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
              <strong>Google Sheet Notice:</strong> This deletion will automatically remove this row from your connected Google Sheet.
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
