import jwt from 'jsonwebtoken';
import JwksClient from 'jwks-client';


const client = JwksClient({
  strictSsl: true,
  jwksUri: `${process.env.NITRO_AUTH_ISSUER_BASE_URL}/.well-known/jwks.json`
})

function getKey(header, callback) {

  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      throw new Error(err.message);
    }
    return callback(null, key.publicKey)
  })
}


export default eventHandler(async (event) => {
  const token = getRequestHeader(event, 'Authorization')?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return new Response(`No auth token provided`, { status: 401 });
  }

  try {

    jwt.verify(token, getKey, {
      audience: process.env.NITRO_AUTH_AUDIENCE,
      issuer: process.env.NITRO_AUTH_ISSUER_BASE_URL
    }, (err, decoded) => {
      if (err) {
        console.error('Token validation error:', err);
        return new Response(`Not allowed: Invalid auth token`, { status: 401 });
      }
      // Store user info in event context
      event.context.user = decoded;
    });


  } catch (err) {
    console.error('Token validation error:', err);
    return new Response(`Not allowed: Invalid auth token`, { status: 401 });
  }
});
