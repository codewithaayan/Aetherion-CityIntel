import { AlertCircle, Database } from "lucide-react";

export function DataNotice({ title, message, error = false }: { title: string; message: string; error?: boolean }) {
  const Icon = error ? AlertCircle : Database;
  return (
    <div className={`rounded-xl border p-4 ${error ? "border-red-500/30 bg-red-950/10" : "border-slate-700 bg-slate-900/50"}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${error ? "text-red-400" : "text-cyan-400"}`} />
        <div>
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{message}</p>
        </div>
      </div>
    </div>
  );
}
