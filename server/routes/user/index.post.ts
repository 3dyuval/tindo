import { sql } from "~~/utils/useDb";

export default eventHandler(async (event) => {

  const secret = getRequestHeader(event, 'x-admin-secret')

  if (!secret || secret !== process.env.NITRO_AUTH_ADMIN_SECRET) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  try {

    const body = await readBody<User>(event);
    const {
        user_id,
        tenant = null,
        username = null,
        email = null,
        phone_number = null,
        created_at,
        updated_at,
        email_verified,
        family_name = null,
        given_name = null,
        name,
        nickname = null,
        phone_verified = false,
        picture = null,
        app_metadata = {},
        user_metadata = {}
    } = body

    const query = `
        INSERT INTO users (user_id, tenant, username, email, phone_number, created_at, updated_at,
                           email_verified, family_name, given_name, name,
                           nickname, phone_verified, picture, app_metadata, user_metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7,
                $8, $9, $10, $11, $12,
                $13, $14, $15, $16) RETURNING id, user_id, name, email;
    `;


    const values = [
      user_id, tenant, username, email, phone_number,
      created_at, updated_at, email_verified, family_name, given_name,
      name, nickname, phone_verified,
      picture, JSON.stringify(app_metadata || {}), JSON.stringify(user_metadata || {})
    ];

    await sql(query, values);
    return new Response('Created user', {
      status: 201
    });

  } catch (error: any) {
    console.error('Error inserting new user:', error);
    return new Response(`Error inserting new user: ${error.message}`, {
      status: 500
    });
  }
});


interface User {
  tenant?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  user_id: string;
  created_at: string;
  email_verified: boolean;
  family_name?: string;
  given_name?: string;
  last_password_reset?: string;
  name?: string;
  nickname?: string;
  phone_number?: string;
  phone_verified?: boolean;
  picture?: string;
  updated_at: string;
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
}