import jwt from "jsonwebtoken";

const generateToken = (payload, secretSignature, accessExp, refreshExp) => {
  const access_token = jwt.sign(payload, secretSignature, {
    expiresIn: accessExp,
  });
  const refresh_token = jwt.sign(payload, secretSignature, {
    expiresIn: refreshExp,
  });
  return {
    access_token,
    refresh_token,
  };
};

/**
 * This module used for verify jwt token
 * @param {*} token
 * @param {*} secretKey
 */
let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};

const jwtHelper = {
  generateToken,
  verifyToken,
};

export default jwtHelper;
