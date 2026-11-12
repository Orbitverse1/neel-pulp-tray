export default function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="NEEL PULP TRAY">
      <svg width="34" height="34" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#173D32" />
        <path d="M14 40h36l-3.2 10.4a4 4 0 0 1-3.8 2.9H21a4 4 0 0 1-3.8-2.9L14 40z" fill="#D8C5A5" />
        <ellipse cx="32" cy="30" rx="10" ry="13" fill="#F5F1E8" />
        <ellipse cx="17" cy="34" rx="5.5" ry="7" fill="#F5F1E8" opacity="0.85" />
        <ellipse cx="47" cy="34" rx="5.5" ry="7" fill="#F5F1E8" opacity="0.85" />
      </svg>
      {!compact && (
        <span className={`font-heading text-[15px] font-bold leading-none tracking-[0.14em] ${light ? "text-cream" : "text-forest"}`}>
          NEEL
          <br />
          PULP TRAY
        </span>
      )}
    </span>
  );
}