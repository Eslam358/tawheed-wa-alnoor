import TNLogo from "@/components/common/TNLogo";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <TNLogo size={64} className="rounded-2xl animate-pulse" />
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-brand-700 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-brand-700 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-brand-700 animate-bounce" />
      </div>
      <p className="text-ink/50 text-sm">جارِ التحميل...</p>
    </div>
  );
}
