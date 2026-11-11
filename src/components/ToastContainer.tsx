import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useEsports();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-right-5 duration-200 ${
              isSuccess
                ? 'bg-[#111114]/95 border-[#075BFF] text-white shadow-[0_10px_30px_rgba(7,91,255,0.25)]'
                : isError
                ? 'bg-[#151111]/95 border-red-500 text-white shadow-[0_10px_30px_rgba(239,68,68,0.25)]'
                : 'bg-[#111114]/95 border-[#23242c] text-white'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-[#075BFF] shrink-0 mt-0.5" />
              ) : isError ? (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-[#888888] shrink-0 mt-0.5" />
              )}
              <span className="text-xs font-mono-code leading-relaxed">
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#888888] hover:text-white p-0.5"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
