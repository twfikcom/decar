import React from 'react';

/** بدون motion على مستوى الصفحة — المحتوى ثابت عند الدخول؛ أنيميشن العناصر الداخلية تبقى في المكوّنات نفسها */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="min-h-0 w-full">{children}</div>;
}
