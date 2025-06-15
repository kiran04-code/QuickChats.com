import { validUser } from "../Auth/jwt.js";

export function checkAuth(cookieName) {
  return async (req, res, next) => {
    const token = req.cookies[cookieName];

    if (!token) {
      return next();
    }

    try {
      const payload = await validUser(token); // ✅ await async verification
      req.user = payload;
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      req.user = null;
    }

    next();
  };
}
