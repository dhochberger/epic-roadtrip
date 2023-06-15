let router = require('express').Router();
const passport = require('passport');
const UserController = require('../controllers/UserController');
const Util = require('../utils/Utils');
const util = new Util();

function authorized(req, res, next) {
    passport.authenticate('jwt', { session: false }, async (error, user) => {
        let token = req.header('Authorization');

        if (token === undefined) {
            util.setError(401, 'No token');
            return util.send(res);
        }

        if (error || !user) {
            util.setError(401, 'Token not valid');
            return util.send(res);
        }

        req.user = user;

        next();
    })(req, res, next);
}

//set default API response
router.get('/', authorized, UserController.getAllUsers);

router.get('/me', authorized, UserController.getProfile);
router.put('/me', authorized, UserController.updateProfile);
router.delete('/me', authorized, UserController.deleteProfile);

router.get('/:id', authorized, UserController.getUser);
//router.post('/', UserController.addUser);
//router.put('/:id', UserController.updateUser);
//router.delete('/:id', UserController.deleteUser);

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);
router.post('/disconnect', authorized, UserController.disconnect);

//Export API routes
module.exports = router;
