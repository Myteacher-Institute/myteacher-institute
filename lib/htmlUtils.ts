export const stripHtml = (html: string): string =>
  (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const countWords = (html: string): number => {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
};
