const TripService = require('../services/TripService');
const Util = require('../utils/Utils');

const util = new Util();

class TripController {
    static async getAllTrips(req, res) {
        try {
            const trips = await TripService.getAllTrips();
            if (trips.length > 0) {
                util.setSuccess(200, 'Trips retrieved', trips);
            } else {
                util.setError(404, 'No trip found');
            }
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }

    static async getTripWithId(req, res) {
        const { id } = req.params;

        try {
            const trip = await TripService.getTripWithId(id);

            if (trip) {
                util.setSuccess(200, 'Trip retrieved', trip);
            }
            else {
                util.setError(404, 'No trip found');
            }
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }

    static async createTrip(req, res) {
        const { itinerary } = req.body;
        const { is_public } = req.body

        if (!itinerary) {
            util.setError(400, "Missing 'itinerary' parameter");
            return util.send(res);
        }
        for (let i=0; i<itinerary.length; i++) {
            if (!itinerary[i].event || !itinerary[i].position) {
                util.setError(400, "Missing 'event' or 'city' or 'position' in itinerary item");
                return util.send(res);
            }
            for (let j=0; j<itinerary[i].event.length;j++) {
                if (!itinerary[i].event[j].name || !itinerary[i].event[j].position) {
                    util.setError(400, "Missing 'name' or 'position' in itinerary.event item");
                    return util.send(res);
                }
            }
        }

        try {
            const trip = await TripService.createTrip({itinerary: itinerary, creator: req.user, is_public: is_public});

            if (trip) {
                util.setSuccess(200, 'Trip created', trip);
            }
            else {
                util.setError(404, 'Couldn\'t create trip');
            }
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }

    static async deleteTrip(req, res) {
        let user = req.user;
        const { id } = req.params;

        try {
            const trip = await TripService.deleteTrip(id, user.id);

            if (trip.n === 0) {
                util.setError(404, 'Can\'t delete trips, either not creator or not found');
            } else util.setSuccess(200, 'Trip deleted');
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
        
    }
    static async getUserTripFromId(req, res) {
        let user = req.user;
        const { id } = req.params;

        try {
            const trip = await TripService.getUserTripFromId(id, req.user.id);

            if (trip.length>0) {
                util.setSuccess(200, 'Trip retrieved', trip);
            }
            else {
                util.setError(404, 'No trip found');
            }
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }
    static async getActivitiesFromGoogleAPI(req, res) {}

    static async getDirectionFromGoogleAPI(req, res) {
        let { origin, destination, mode } = req.query;
        if (!mode) mode = 'driving';

        if (!origin || !destination) {
            util.setError(400, "Missing 'origin' and 'destination' parameters");
            return util.send(res);
        }

        try {
            const travel = await TripService.getDirectionFromGoogleAPI(origin, destination, mode);

            if (travel.routes.length > 0) {
                util.setSuccess(200, 'Direction retrieved', travel);
            }
            else {
                util.setError(404, 'No datas found');
            }
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }

    static async getHotelsFromGoogleAPI(req, res) {
        let { place, radius } = req.query;
        if (!radius) radius = 2500;

        if (!place) {
            util.setError(400, "Missing 'place' parameters");
            return util.send(res);
        }

        try {
            const hotels = await TripService.getHotelsFromGoogleAPI(place, radius);
            if (hotels.length > 0) {
                let res_hotels = formatGoogleDatas(hotels, 'lodging');
                util.setSuccess(200, 'Hotels retrieved', res_hotels);
            } else {
                util.setError(404, 'No datas found');
            }
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }

    static async getRestaurantsFromGoogleAPI(req, res) {
        let { place, radius, minprice, maxprice } = req.query;
        if (!radius) radius = 2500;
        if (!minprice) minprice = 0
        if (!maxprice) maxprice = 4

        if (!place) {
            util.setError(400, "Missing 'place' parameters");
            return util.send(res);
        }

        try {
            const restaurants = await TripService.getRestaurantsFromGoogleAPI(place, radius, minprice, maxprice);
            if (restaurants.length > 0 ) {
                let res_restaurants = formatGoogleDatas(restaurants, 'restaurant');
                util.setSuccess(200, 'Transports retrieved', res_restaurants);
            } else {
                util.setError(404, 'No datas found');
            }
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }

    static async getBarsFromGoogleAPI(req, res) {
        let { place, radius, minprice, maxprice } = req.query;
        if (!radius) radius = 2500;
        if (!minprice) minprice = 0
        if (!maxprice) maxprice = 4

        if (!place) {
            util.setError(400, "Missing 'place' parameters");
            return util.send(res);
        }

        try {
            const bars = await TripService.getBarsFromGoogleAPI(place, radius, minprice, maxprice);
            if (bars.length > 0 ) {
                let res_Bars = formatGoogleDatas(bars, 'bar');
                util.setSuccess(200, 'bars retrieved', res_Bars);
            } else {
                util.setError(404, 'No datas found');
            }
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }

    static async getTransportsFromGoogleAPI(req, res) {
        let { place, radius } = req.query;
        if (!radius) radius = 2500;

        if (!place) {
            util.setError(400, "Missing 'place' parameters");
            return util.send(res);
        }

        try {
            const transports = await TripService.getTransportsFromGoogleAPI(place, radius);
            let res_airports, res_car_rental, res_light_rail, res_subway, res_train, merge = []

            if (transports.airports.length > 0 ) {
                res_airports = formatGoogleDatas(transports.airports, 'airports');

                merge = merge.concat(res_airports)
            }
            if (transports.car_rental.length > 0 ) {
                res_car_rental = formatGoogleDatas(transports.car_rental, 'car_rental');
                merge = merge.concat(res_car_rental)
            }
            if (transports.light_rail.length > 0 ) {
                res_light_rail = formatGoogleDatas(transports.light_rail, 'light_rail');
                merge = merge.concat(res_light_rail)
            }
            if (transports.subway.length > 0 ) {
                res_subway = formatGoogleDatas(transports.subway, 'subway');
                merge = merge.concat(res_subway)
            }
            if (transports.train.length > 0 ) {
                res_train = formatGoogleDatas(transports.train, 'train');
                merge = merge.concat(res_train)
            }

            if (merge.length>0){
                util.setSuccess(200, 'Transports retrieved', merge);
            } else {
                util.setError(404, 'No datas found');
            }

            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }

    static async getPOIFromAmadeusAPI(req, res) {
        let { latitude, longitude, radius } = req.query;
        if (!radius) radius = 4;
        else radius = radius / 1000;

        if (!latitude && !longitude) {
            util.setError(400, "Missing 'latitude' and 'longitude' parameters");
            return util.send(res);
        }

        try {
            const poi = await TripService.getPOIFromAmadeusAPI(latitude, longitude, radius);
            util.setSuccess(200, `POI retrieved`, poi);
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }

    static async getSpecificFromGoogleAPI(req, res) {
        let { types, place, radius } = req.query;
        if (!radius) radius = 2500;

        if (!types && !place) {
            util.setError(400, "Missing 'types' and 'place' parameters");
            return util.send(res);
        }

        try {
            const specific_place = await TripService.getSpecificFromGoogleAPI(types, place, radius);
            util.setSuccess(200, `${types} retrieved`, specific_place);
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            return util.send(res);
        }
    }

    static async getPointsFromOpenTripMapApi(req, res) {
        let { lat, lon, radius, kinds } = req.query;

        if (!radius) radius = 2500;

        if (!lat) {
            util.setError(400, "Missing 'lat' parameter");
            return util.send(res);
        }

        if (!lon) {
            util.setError(400, "Missing 'lon' parameter");
            return util.send(res);
        }

        try {
            const points = await TripService.getPointsFromOpenTripMapApi(lat, lon, radius, kinds);

            util.setSuccess(200, `points`, formatDatas(points.data.features));
            return util.send(res);
        } catch (error) {
            util.setError(500, 'Internal error');
            if (error.response?.status == 400 && error.response.data?.error.startsWith('Unknown category name:')) {
                util.setError(400, 'Unknown category name: ' + kinds);
            }
            return util.send(res);
        }
    }
}

function formatGoogleDatas(datas, type) {
    let res_datas = datas.map((key) => {
        let photos = ''
        if (key.photos && key.photos.length>0){
            let tmp_photos = key.photos[0]?.html_attributions[0]?.split('\\')
            photos = tmp_photos[0].split('"')
        }
        return {
            name: key.name,
            description: key.vicinity,
            position: {
                lon: key.geometry.location.lng,
                lat: key.geometry.location.lat,
            },
            photo: photos && photos.length>0 ? photos[1] : '',
            website: '',
            type: type
        }
    })
    return res_datas
}

function formatDatas(datas) {
    datas = [
        {
            type: 'Feature',
            id: '12381595',
            geometry: {
                type: 'Point',
                coordinates: [7.75049, 48.583099],
            },
            properties: {
                xid: 'Q14628591',
                name: 'maison Spach',
                dist: 42.44558716,
                rate: 7,
                wikidata: 'Q14628591',
                kinds: 'historic_architecture,architecture,interesting_places,other_buildings_and_structures',
            },
        },
        {
            type: 'Feature',
            id: '12925086',
            geometry: {
                type: 'Point',
                coordinates: [7.75068, 48.583199],
            },
            properties: {
                xid: 'Q15952139',
                name: 'maison Saré',
                dist: 51.38821924,
                rate: 7,
                wikidata: 'Q15952139',
                kinds: 'historic_architecture,architecture,interesting_places,other_buildings_and_structures',
            },
        },
        {
            type: 'Feature',
            id: '3488886',
            geometry: {
                type: 'Point',
                coordinates: [7.75074, 48.582897],
            },
            properties: {
                xid: 'N5030606956',
                name: "Carré d'artistes",
                dist: 70.69218478,
                rate: 1,
                osm: 'node/5030606956',
                kinds: 'museums,cultural,interesting_places,art_galleries',
            },
        },
        {
            type: 'Feature',
            id: '3225011',
            geometry: {
                type: 'Point',
                coordinates: [7.750248, 48.582489],
            },
            properties: {
                xid: 'N6513001510',
                name: 'YellowKorner',
                dist: 92.09497608,
                rate: 1,
                osm: 'node/6513001510',
                kinds: 'urban_environment,cultural,interesting_places,installation',
            },
        },
        {
            type: 'Feature',
            id: '12545536',
            geometry: {
                type: 'Point',
                coordinates: [7.751, 48.582699],
            },
            properties: {
                xid: 'Q2361353',
                name: 'Argentoratum',
                dist: 99.47502293,
                rate: 3,
                wikidata: 'Q2361353',
                kinds: 'historic,archaeology,interesting_places,other_archaeological_sites',
            },
        },
    ];

    let formatedDatas = [];

    datas.map(function (data) {
        formatedData = {
            date: '',
            name: data.properties.name,
            description: '',
            position: {
                lon: data.geometry.coordinates[0],
                lat: data.geometry.coordinates[1],
            },
            website: '',
            photo: '',
            type: data.type,
        };

        formatedDatas.push(formatedData);
    });

    return formatedDatas;
}

module.exports = TripController;
