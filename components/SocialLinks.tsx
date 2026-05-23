import { Facebook, Instagram } from 'lucide-react';

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialLinks = [
  {
    href: '#',
    labelKey: 'facebook' as const,
    Icon: Facebook,
  },
  {
    href: '#',
    labelKey: 'instagram' as const,
    Icon: Instagram,
  },
  {
    href: '#',
    labelKey: 'x' as const,
    Icon: XLogo,
  },
];

type SocialLabels = Record<(typeof socialLinks)[number]['labelKey'], string>;

export default function SocialLinks({ labels }: { labels: SocialLabels }) {
  return (
    <div className="flex items-center gap-3">
      {socialLinks.map(({ href, labelKey, Icon }) => (
        <a
          key={labelKey}
          href={href}
          {...(href !== '#'
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
          aria-label={labels[labelKey]}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 transition-all hover:border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-[0_4px_14px_rgba(249,115,22,0.35)]"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
