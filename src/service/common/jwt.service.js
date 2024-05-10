const jwt = require('jsonwebtoken');


module.exports = class JwtService {
      constructor() {
            this.secretKey = process.env.SECRET_KEY;
            this.expireIn = process.env.EXPIRE_IN;
      }

      //-----------------------------------------------[ Generate Token ]-------------------------------------------------
      async generateToken(payload) {
            return jwt.sign(payload, this.secretKey, { expiresIn: this.expireIn })
      }

      //-----------------------------------------------[ Verify Token ]-------------------------------------------------
      async verifyToken(token) {
            return jwt.verify(token, this.secretKey);
      }
}