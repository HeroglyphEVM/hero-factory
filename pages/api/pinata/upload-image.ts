import type { NextApiRequest, NextApiResponse } from "next";

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  if (!jwt)
    return res.status(500).json({ error: "Missing NEXT_PUBLIC_PINATA_JWT" });

  const ct = req.headers["content-type"];
  const contentType = Array.isArray(ct) ? ct[0] : ct;
  if (!contentType?.startsWith("multipart/form-data")) {
    return res.status(400).json({ error: "Expected multipart/form-data" });
  }

  try {
    const pinataRes = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": contentType, // must include boundary
        },
        body: req as any, // stream through
        // @ts-expect-error: Node fetch streaming option
        duplex: "half",
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
