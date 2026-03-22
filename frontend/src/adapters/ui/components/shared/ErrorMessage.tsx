import { AlertTriangle } from 'lucide-react';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border
                    border-red-500/30 bg-red-500/10 px-4 py-3 text-sm
                    text-red-400">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}