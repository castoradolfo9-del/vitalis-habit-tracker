export default function Toast({ message }: { message: string | null }) {
  return (
    <div
      className={`fixed bottom-3.5 left-1/2 -translate-x-1/2 bg-purple-dark text-white px-4 py-2 rounded-full text-xs font-semibold pointer-events-none transition-all duration-300 ${
        message ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {message}
    </div>
  );
}
