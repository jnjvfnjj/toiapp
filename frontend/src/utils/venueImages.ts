export function getVenueFallbackImageUrl(params: { name?: string; type?: string; id?: string | number }): string {
  const qRaw = (params.type || params.name || 'banquet hall').trim();
  const q = encodeURIComponent(qRaw);
  // Use a stable size; Source endpoint returns a random relevant image.
  // We add a "sig" based on id to reduce changes between renders.
  const sig = encodeURIComponent(String(params.id ?? qRaw));
  return `https://source.unsplash.com/800x600/?${q}&sig=${sig}`;
}

