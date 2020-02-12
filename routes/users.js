const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/userController');
const passportLocal = passport.authenticate('local', {session: false});
const passportJWT = passport.authenticate('jwt', {session: false});
const passportGoogle = passport.authenticate('googleToken', {session: false});

router.route('/signup').post(validateBody(schemas.authSchema),UsersController.signUp);

router.route('/login').post(validateBody(schemas.authSchema), passportLocal, UsersController.login);

router.route('/secret').get(passportJWT, UsersController.secret);

router.route('/oauth/google').post(passportGoogle, UsersController.googleOAuth);

module.exports = router;