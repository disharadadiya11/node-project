const { authMiddleware } = require('./auth.middleware');
const { protectedRoutes } = require('./protectedRoutes.routes');

// Middleware to apply authMiddleware to specific routes
module.exports.applyAuthMiddleware = (req, res, next) => {
      const matchingRoute = protectedRoutes.some(route => {
            const routePath = route.path.replace(/\/:[^/]+/g, '/[^/]+'); // Replace dynamic parameters with regex
            const routeRegex = new RegExp(`^${routePath}$`); // Create regex pattern
            return routeRegex.test(req.path) && route.methods.includes(req.method); // Check if path matches pattern and method is allowed
      });
      
      if (matchingRoute) {
            authMiddleware(req, res, next);
      } else {
            next();
      }
};


