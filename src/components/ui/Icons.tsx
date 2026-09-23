type IconProps = { className?: string };

export function LinkedinIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24ZM8.5 17.5H6V9.75h2.5v7.75ZM7.25 8.7a1.45 1.45 0 1 1 0-2.9 1.45 1.45 0 0 1 0 2.9Zm10.25 8.8H15v-3.77c0-.9-.02-2.05-1.25-2.05-1.25 0-1.44.98-1.44 1.99v3.83h-2.5V9.75h2.4v1.06h.03a2.63 2.63 0 0 1 2.37-1.3c2.53 0 3 1.67 3 3.83v4.16Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** The little "share" node glyph shown on person cards */
export function ShareIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
