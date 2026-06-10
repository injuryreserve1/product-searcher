import { expressjwt } from "express-jwt";
import config from "../config/config";

export const requireAuth = expressjwt({
  secret: config.jwt_access,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.authcookie,
});
