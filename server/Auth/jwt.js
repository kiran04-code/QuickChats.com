import jwt from "jsonwebtoken";
const secretKey = "kk9009"; // ✅ fixed typo: 'screteKey' → 'secretKey'

// Token generator (sync)
export function createToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    bio: user.bio
  };

  return jwt.sign(payload, secretKey);
}

// Token validator (sync)
export function validUser(token) {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}
