import React from 'react';

/**
 * Wraps every occurrence of `query` inside `text` in a styled <mark> element.
 * Used in the desktop search-bar dropdown.
 */
export function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-accent-gold text-primary-dark font-bold rounded-sm">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/**
 * Wraps every occurrence of `filter` inside `text` in a gold highlight span.
 * Used in the pandal list cards.
 */
export function highlightMatch(text: string, filter: string): React.ReactNode {
  const normalised = text.toLowerCase();
  if (!filter) return normalised;
  const escaped = filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = normalised.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-accent-gold text-primary-dark">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
