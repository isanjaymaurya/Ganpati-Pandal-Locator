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
      <mark key={i} className="bg-accent-gold/30 text-primary-dark font-bold rounded-sm">
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
  if (!filter) return text;
  const regex = new RegExp(`(${filter})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-gold-light text-text-primary">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
