// api/livekit-token.js
// Vercel serverless function: kullanıcı için LiveKit token üretir

import { AccessToken } from 'livekit-server-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST kullanın' });
  }

  const { room, identity, name } = req.body;

  if (!room || !identity) {
    return res.status(400).json({ error: 'room ve identity gerekli' });
  }

  try {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity, name }
    );

    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true
    });

    const token = await at.toJwt();
    res.status(200).json({
      token,
      wsUrl: process.env.LIVEKIT_URL
    });
  } catch (err) {
    console.error('Token error:', err);
    res.status(500).json({ error: err.message });
  }
}
