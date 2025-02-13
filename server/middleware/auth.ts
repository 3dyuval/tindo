import jwt from 'jsonwebtoken';
import JwksClient from 'jwks-client';

const client = JwksClient({
  strictSsl: true,
  jwksUri: `${process.env.NITRO_AUTH_ISSUER_BASE_URL}.well-known/jwks.json`
});

export default defineEventHandler(async (event) => {
  if (process.env.NITRO_DISABLE_AUTHENTICATION) {
    event.context.user = { roles: ['admin'] };
    return
  }

  const token = getRequestHeader(event, 'Authorization')?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return new Response(`No auth token provided`, { status: 401 });
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, {
        audience: process.env.NITRO_AUTH0_CLIENT_ID,
        issuer: process.env.NITRO_AUTH_ISSUER_BASE_URL
      }, (err, decoded) => {
        if (err) {
          console.error('Token validation error:', err);
          return reject(new Response(`Not allowed: Invalid auth token`, { status: 401 }));
        }
        resolve(decoded);
      });
    });

    event.context.user = decoded;

  } catch (err) {
    console.error('Token validation error:', err);
    return new Response(`Not allowed: Invalid auth token`, { status: 401 });
  }
});


function getKey(header, callback) {
    client.getSigningKey(header.kid, function(err, key) {
      if (err) {
        throw new Error(err.message)
      }
      callback(null, key.publicKey)
    });
}
