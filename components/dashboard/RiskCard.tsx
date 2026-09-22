import { Car, CloudRain, Flame, Trees, Users, Wind, type LucideIcon } from "lucide-react";

const ICONS: Record<string, { icon: LucideIcon; color: string }> = { heat: { icon: Flame, color: "text-red-400" }, air: { icon: Wind, color: "text-amber-400" }, flood: { icon: CloudRain, color: "text-sky-400" }, green: { icon: Trees, color: "text-emerald-400" }, mobility: { icon: Car, color: "text-blue-400" }, population: { icon: Users, color: "text-purple-400" } };

export function RiskCard({ title, score, iconType }: { title: string; score: number | null; iconType: keyof typeof ICONS }) {
  const config = ICONS[iconType];
  const Icon = config.icon;
  return <div className="rounded-2xl border border-slate-800/80 p-5 glass-panel"><Icon className={`h-5 w-5 ${config.color}`} /><h4 className="mt-4 text-xs font-mono uppercase tracking-wider text-slate-300">{title}</h4><div className="mt-1 text-3xl font-extrabold font-mono text-white">{score ?? "—"}</div><p className="mt-3 border-t border-slate-800 pt-3 text-[11px] text-slate-500">Supplied score; interpretation pending methodology.</p></div>;
}
