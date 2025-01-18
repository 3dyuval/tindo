//@ts-nocheck

// import { fromNodeMiddleware } from "h3";
// import { auth } from 'express-oauth2-jwt-bearer'

//
// const auth = (opts: AuthOptions = {}): Handler => {
//   const verifyJwt = jwtVerifier(opts);
//
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const jwt = getToken(
//           req.headers,
//           req.query,
//           req.body,
//       );
//       req.auth = await verifyJwt(jwt);
//       next();
//     } catch (e) {
//       if (opts.authRequired === false) {
//         next();
//       } else {
//         next(e);
//       }
//     }
//   };
// };

export default defineEventHandler(async (event) => {
  // get the bearer
  //validate
  // console.log('auth', await readBody(event))
})

// export default fromNodeMiddleware(auth({
//   audience: process.env.AUTH_AUDIENCE,
//   issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL
// }))