export const fetchFromUrl = async (url: string) => {
  try {
    const response = await fetch(`/api/ipfs?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return data;
    } else if (contentType?.includes("image")) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } else {
      const text = await response.text();
      return text;
    }

  } catch (error) {
    console.error("Error fetching from URL:", error);
    throw error;
  }
};


export const resolveUrl = (url: string) => {
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
  }
  return url;
}