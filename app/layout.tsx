import type { ReactNode } from 'react';

/** Root passes children to `[locale]/layout` which provides `<html>` and `<body>`. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
