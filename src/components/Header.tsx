import React from 'react';
import { User } from 'firebase/auth';
import {
  Wrench,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Printer,
} from 'lucide-react';
import { SheetSyncStatus } from '../types/motorPart';
import { formatPHP } from '../utils/formatCurrency';

interface HeaderProps {
  user: User | null;
  syncStatus: SheetSyncStatus;
  isLoggingIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onOpenAddModal: () => void;
  onOpenSheetConfig: () => void;
  onOpenPrintModal: () => void;
  onManualSync: () => void;
  totalParts: number;
  totalSrpValue: number;
  totalShopValue: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  syncStatus,
  isLoggingIn,
  onLogin,
  onLogout,
  onOpenAddModal,
  onOpenSheetConfig,
  onOpenPrintModal,
  onManualSync,
  totalParts,
  totalSrpValue,
  totalShopValue,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 py-2 sm:py-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-slate-950">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white truncate flex items-center gap-1">
                  <span>MotoParts</span>
                  <span className="text-amber-400 font-extrabold">PRICELIST</span>
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  PHP ₱
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Motorcycle Parts Catalog with SRP &amp; Shop Wholesale Pricing (PHP)
              </p>
            </div>
          </div>

          {/* Quick Metrics (Desktop only) */}
          <div className="hidden lg:flex items-center space-x-5 border-x border-slate-800 px-5">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Total Items</div>
              <div className="text-sm font-bold text-slate-100">{totalParts} items</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-400">SRP Inventory</div>
              <div className="text-sm font-bold text-amber-300">
                {formatPHP(totalSrpValue)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400">Shop Value</div>
              <div className="text-sm font-bold text-emerald-300">
                {formatPHP(totalShopValue)}
              </div>
            </div>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Sheet Sync Status Button */}
            <button
              onClick={onOpenSheetConfig}
              className={`flex items-center space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                syncStatus.isConnected
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/80'
              }`}
              title={syncStatus.isConnected ? 'Google Sheet Connected' : 'Connect Google Sheet'}
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${syncStatus.isConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden xs:inline text-[11px] sm:text-xs">
                {syncStatus.isConnected ? (
                  syncStatus.isSyncing ? 'Syncing...' : 'Sheet'
                ) : (
                  'Connect'
                )}
              </span>
              {syncStatus.isConnected && (
                <span className="relative flex h-2 w-2 shrink-0">
                  {syncStatus.isSyncing ? (
                    <span className="animate-spin inline-block h-2 w-2 rounded-full border border-emerald-400 border-t-transparent"></span>
                  ) : (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </>
                  )}
                </span>
              )}
            </button>

            {/* Manual Sync Icon (When Connected) */}
            {syncStatus.isConnected && (
              <button
                onClick={onManualSync}
                disabled={syncStatus.isSyncing}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
                title="Sync now with Google Sheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${syncStatus.isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            )}

            {/* Print Catalog Button */}
            <button
              onClick={onOpenPrintModal}
              className="p-1.5 sm:p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition hidden md:inline-flex"
              title="Printable Pricelist"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Add Part Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all transform active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              <span className="hidden xs:inline">Add Part</span>
              <span className="xs:hidden">Add</span>
            </button>

            {/* Auth / Sign In Section */}
            {user ? (
              <div className="flex items-center space-x-1.5 pl-1 border-l border-slate-800">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-700 shrink-0"
                    title={user.displayName || user.email || 'Signed in'}
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center border border-slate-700 shrink-0">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="text-[11px] text-slate-400 hover:text-red-400 transition hidden sm:inline"
                  title="Sign out"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                disabled={isLoggingIn}
                className="gsi-material-button inline-flex items-center justify-center bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold shadow-sm transition shrink-0"
                title="Sign in with Google"
              >
                <div className="flex items-center space-x-1">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span className="hidden xs:inline">Sign In</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
