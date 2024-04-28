const Authorize = require('../Middleware/Authorize.js');
const VerifyJWT = require('../Middleware/VerifyJWT.js');
const LoginController = require('../Controllers/LoginController.js');
const moneyController = require('../Controllers/moneyController.js');
const friendController = require('../Controllers/FriendController.js');
const avatarController = require('../Controllers/AvatarController.js');
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
const friendRouter = require('koa-router')({
    prefix: '/friend'
});
const avatarRouter = require('koa-router')({
    prefix: '/avatar'
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
moneyRouter.get('/update/:money/:userName/:avatar', moneyController.updateMoney);
//update the game Money for the users when the buy in 
moneyRouter.get('/update/game/money/:money/:userName', moneyController.updateGameMoney);


//Friend routes

friendRouter.get('/show/:userName1/:userName2/:rStatus', friendController.showFriends);
// Route for all users
friendRouter.get('/search/:userName', friendController.searchFriends);
// Route for creating a user (GET request)
friendRouter.get('/add/:userID1/:userName1/:userID2/:userName2/:rStatus', friendController.addFriend);
// Route for creating a user (GET request)
friendRouter.get('/accept/:userID1/:userID2', friendController.acceptRequest);
friendRouter.get('/reject/:userID1/:userID2', friendController.rejectRequest);


//AVATAR ROUTEs!!
avatarRouter.get('/search/:userName', avatarController.showAvatars);
// Route for creating a user (GET request)
avatarRouter.get('/insert/:userID/:userName/:avatar', avatarController.insertAvatars);

// Register routers
router.use(
    '',
    loginRouter.routes(),
    moneyRouter.routes(),
    friendRouter.routes(),
    avatarRouter.routes(),
);




module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
