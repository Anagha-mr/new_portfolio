/**
 * The experiment's hint, or a plain note when it is shown as a still. Chosen
 * by media query in CSS, so the server HTML is already correct and nothing
 * swaps after hydration.
 */
export function InteractionHint({ instructions, className = "" }: { instructions?: string; className?: string }) {
  return (
    <p
      className={`font-mono text-xs uppercase tracking-[0.2em] text-stone ${
        instructions ? "" : "hidden motion-reduce:block"
      } ${className}`}
    >
      {instructions && <span className="motion-reduce:hidden">{instructions}</span>}
      <span className="hidden motion-reduce:inline">Still view — reduced motion</span>
    </p>
  );
}
