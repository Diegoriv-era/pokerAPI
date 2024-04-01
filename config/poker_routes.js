const Authorize = require('../Middleware/Authorize.js');
const VerifyJWT = require('../Middleware/VerifyJWT.js');
const LoginController = require('../Controllers/LoginController.js');
const moneyController = require('../Controllers/moneyController.js');

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


const moneyRouter = require('koa-router')({
    prefix: '/money'
});
// Route for user authorization
loginRouter.get('/:userName', LoginController.authorizeUser);
// Route for all users
loginRouter.get('/check/all', LoginController.allUsers);
// Route for creating a user (GET request)
loginRouter.get('/create/:userName/:userPassword/:avatar', LoginController.createUser);
// Route for creating a user (GET request)
loginRouter.get('/get/:userName', LoginController.changeColor);


//update the moneyy attribute for the given user
moneyRouter.get('/update/:money/:userName', moneyController.updateMoney);




// Register routers
router.use(
    '',
    loginRouter.routes(),
    moneyRouter.routes(),
);


moneyRouter.get('/update/:money/:userName', moneyController.updateMoney);


module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
