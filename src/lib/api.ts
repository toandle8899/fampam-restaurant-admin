export const apiFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(`/api${url}`, options);
  if (!res.ok) {
    let message = 'An error occurred';
    const text = await res.text();
    try {
      if (text) {
        const err = JSON.parse(text);
        message = err.error || message;
      }
    } catch {
      message = text || message;
    }
    throw new Error(message);
  }
  
  // If no content, just return empty object
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return text; // fallback if it's returning plain text
  }
};
