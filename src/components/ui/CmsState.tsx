import React from 'react';
import { Loader2, Inbox, AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Memuat informasi...',
}) => (
  <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
    <Loader2 className="w-8 h-8 text-[#0f5132] animate-spin" />
    <p className="text-sm font-medium text-stone-600">{message}</p>
  </div>
);

interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'Belum ada informasi yang tersedia.',
  submessage,
}) => (
  <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-3 bg-white border border-stone-200 rounded-3xl">
    <Inbox className="w-10 h-10 text-stone-400" />
    <p className="text-base font-bold text-stone-800">{message}</p>
    {submessage && <p className="text-xs text-stone-500 max-w-md">{submessage}</p>}
  </div>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Informasi belum dapat dimuat. Silakan coba kembali beberapa saat lagi.',
  onRetry,
}) => (
  <div className="py-10 px-6 flex flex-col items-center justify-center text-center space-y-3 bg-amber-50/80 border border-amber-200 rounded-3xl">
    <AlertCircle className="w-9 h-9 text-amber-700" />
    <p className="text-sm font-semibold text-amber-900 max-w-md">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 transition"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Coba Lagi</span>
      </button>
    )}
  </div>
);
