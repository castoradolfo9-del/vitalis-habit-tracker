export default function QuoteCard({ quote }: { quote: { texto: string; autor: string } }) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-purple/15 to-pink/10 p-4 pb-3 mb-4">
      <span className="text-2xl text-purple-light opacity-70">❝</span>
      <p className="italic text-[13px] leading-relaxed mt-0.5">{quote.texto}</p>
      <span className="block text-right text-xs text-text-dim mt-1.5">— {quote.autor}</span>
    </div>
  );
}
