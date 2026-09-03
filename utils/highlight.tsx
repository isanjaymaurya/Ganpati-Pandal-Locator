import React from 'react';

function highlightWith(
  text: string,
  query: string,
  className: string,
): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? React.createElement('span', { key: i, className }, part)
      : part,
  );
}

export function highlightMatch(text: string, filter: string): React.ReactNode {
  return highlightWith(text, filter, 'bg-accent-gold text-primary-dark');
}
