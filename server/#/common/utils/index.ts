export const isInterinsicTag = (tagName: string) => {
  const firstChar = tagName.charAt(0);

  return firstChar === firstChar.toLowerCase();
};
