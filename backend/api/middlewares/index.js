const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const User = require('../models/user.model');

// Cliente para obtener claves públicas de Auth0
const client = jwksClient({
  jwksUri: `${process.env.ISSUER_BASE_URL}.well-known/jwks.json`,
});

// Extrae la clave pública a partir del header del token
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔐 Token recibido:', token);

  jwt.verify(
    token,
    getKey,
    {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.ISSUER_BASE_URL, // ya tiene el slash final
      algorithms: ['RS256'],
    },
    async (err, decoded) => {
      if (err) {
        console.error('❌ Error verificando JWT:', err.message);
        return res.status(401).json({
          success: false,
          message: 'Unauthorized.',
          description: err.message,
        });
      }

      console.log('✅ Token decodificado:', decoded);

      try {
        const user = await User.findOne({ auth0Id: decoded.sub });

        if (!user) {
          console.warn('⚠️ Usuario no encontrado con auth0Id:', decoded.sub);
          return res.status(401).json({
            success: false,
            message: 'User not found in database.',
          });
        }

        res.locals.user = user;
        next();
      } catch (error) {
        console.error('❌ Error interno al buscar usuario:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error.',
          description: error.message,
        });
      }
    }
  );
};

const checkSubscription = async (req, res, next) => {
  const user = res.locals.user;

  if (user.role === 'company' && user.activeSubscription) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      user.activeSubscription.currentPeriodEnd <= today &&
      ['active', 'canceling'].includes(user.activeSubscription.status)
    ) {
      user.activeSubscription.status = 'canceled';
      user.role = 'basic';
      await user.save();
    }
  }

  next();
};



const checkRole = (...roles) => {
  return (req, res, next) => {
    try {
      const { user } = res.locals

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        })
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: role required.',
        })
      }
      next()
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Internal Server Error.',
        description: error.message,
      })
    }
  }
}

module.exports = {
  isAuth,
  checkSubscription,
  checkRole
};
