const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const APP_SECRET = "secret";

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer", "").trim();
      if (!token) {
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
      const tokenPayload = getTokenPayload(token);
      return tokenPayload.userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    console.log("authToken", userId);
    return userId;
  }
  throw new Error("Not authenticated");
}

module.exports = {
  APP_SECRET,
  getUserId,
};
