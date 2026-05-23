type MercedesBenzIconProps = {
  className?: string;
};

/** Mercedes-Benz star — not available on Simple Icons CDN. */
export default function MercedesBenzIcon({ className }: MercedesBenzIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75S17.385 21.75 12 21.75 2.25 17.385 2.25 12 6.615 2.25 12 2.25Zm0 1.5a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5Zm-4.72 6.75h2.19l2.53-7.78 2.53 7.78h2.19L12 17.03 7.28 10.5Z" />
    </svg>
  );
}
