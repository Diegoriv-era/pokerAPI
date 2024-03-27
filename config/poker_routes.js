const Authorize = require('../Middleware/Authorize.js');
const VerifyJWT = require('../Middleware/VerifyJWT.js');
const LoginController = require('../Controllers/LoginController.js');

const router = require('koa-router')({
    prefix: '/api/v1'
});

// Default route
router.get('/', function (ctx) {
    console.log('router.get(/)');
    return ctx.body = 'What is up?';
});

// Login routes
const loginRouter = require('koa-router')({
    prefix: '/login'
});

// Route for user authorization
loginRouter.get('/:userName', LoginController.authorizeUser);
// Route for all users
loginRouter.get('/check/all', LoginController.allUsers);

// Route for creating a user (GET request)
loginRouter.get('/create/:userName/:userPassword/:avatar', LoginController.createUser);

// Register routers
router.use('', loginRouter.routes());

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
