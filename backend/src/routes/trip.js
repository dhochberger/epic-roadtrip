let router = require('express').Router();
const passport = require('passport');
const TripController = require('../controllers/TripController');
const { Trip } = require('../models/trip');
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

router.get('/directions', TripController.getDirectionFromGoogleAPI);

router.get('/hotels', TripController.getHotelsFromGoogleAPI);
router.get('/restaurants', TripController.getRestaurantsFromGoogleAPI);
router.get('/bars', TripController.getBarsFromGoogleAPI);
router.get('/transports', TripController.getTransportsFromGoogleAPI);

router.get('/activities', TripController.getActivitiesFromGoogleAPI);
//router.get('/poi', TripController.getPOIFromAmadeusAPI);

router.get('/specific', TripController.getSpecificFromGoogleAPI);

router.get('/otm/poi', TripController.getPointsFromOpenTripMapApi);

router.get('/', TripController.getAllTrips);
router.get('/:id', TripController.getTripWithId);
router.post('/', authorized, TripController.createTrip);
router.delete('/:id', authorized, TripController.deleteTrip);
router.get('/user/:id', authorized, TripController.getUserTripFromId);


//Export API routes
module.exports = router;