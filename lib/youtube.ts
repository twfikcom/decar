export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;

  try {
    const parsed = new URL(url.trim());

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace(/^\//, '').split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtube-nocookie.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.toString();
      }

      const id = parsed.searchParams.get('v');
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }

      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) {
        return `https://www.youtube.com/embed/${shortsMatch[1]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}
