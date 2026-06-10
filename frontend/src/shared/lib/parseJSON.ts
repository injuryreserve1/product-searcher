export const extractJsonArray = (text: string) => {
  try {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]") + 1;
    if (start === -1 || end === 0) return null;
    return JSON.parse(text.substring(start, end));
  } catch (e) {
    console.error("Failed to parse products JSON", e);
    return null;
  }
};
