export const apiFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(`/api${url}`, options);
  if (!res.ok) {
    let message = 'An error occurred';
    try {
      const err = await res.json();
      message = err.error || message;
    } catch {
      message = await res.text();
    }
    throw new Error(message);
  }
  return res.json();
};
