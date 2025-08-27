import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  if (!jwt)
    return res.status(500).json({ error: "Missing NEXT_PUBLIC_PINATA_JWT" });

  try {
    const pinataRes = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const text = await pinataRes.text();
    if (!pinataRes.ok) {
      try {
        return res.status(pinataRes.status).json(JSON.parse(text));
      } catch {
        return res.status(pinataRes.status).json({ error: text });
      }
    }

    try {
      return res.status(200).json(JSON.parse(text));
    } catch {
      return res.status(200).send(text);
    }
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Upload failed" });
  }
}
