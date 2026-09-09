import React from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warn';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className="pointer-events-auto p-3.5 px-4 rounded-xl bg-neutral-900 border border-neutral-700 shadow-xl text-neutral-100 flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom duration-200 cursor-pointer hover:border-neutral-500"
        >
          {t.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : t.type === 'warn' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  );
};
