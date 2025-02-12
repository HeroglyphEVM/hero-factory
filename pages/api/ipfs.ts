import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const urlValue = Array.isArray(url) ? url[0] : url;
    const response = await fetch(urlValue);

    // Check if the response is ok
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    // Get the content type of the response
    const contentType = response.headers.get('Content-Type');
    
    if (!contentType) {
      // Handle the case when the content type is not available
      return res.status(500).json({ error: 'Failed to get content type' });
    }
    
    res.setHeader('Content-Type', contentType);
    
    // Send the response data to the client
    const data = await response.arrayBuffer(); // Handle various content types
    res.send(Buffer.from(data));
  } catch (error) {
    console.error('Error fetching the URL:', error);
    return res.status(500).json({ error: 'Failed to fetch the requested resource' });
  }
}
