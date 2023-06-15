const { Trip, RoadPoint, Event } = require('../models/trip');
const qs = require('qs');
require('dotenv').config({ path: '../.env.api' });

const axios = require('axios');

const OTM_URL = process.env.OPENTRIPMAP_API_URL;
const OTM_TOKEN = process.env.OPENTRIPMAP_API_TOKEN;

class TripService {
    static async getAllTrips() {
        try {
            return await Trip.find({is_public: true});
        } catch (error) {
            throw error;
        }
    }

    static async getTripWithId(id) {
        try {
            return await Trip.findOne({ _id: id });
        } catch (error) {
            throw error;
        }
    }
    static async createTrip(trip) {
        try {
            return await Trip.create(trip);
        } catch (error) {
            throw error;
        }
    }
    static async deleteTrip(id, user_id) {

        try {
            return await Trip.deleteOne({_id: id, "creator._id": user_id});
        } catch (error) {
            throw error;
        }
    }
    static async getUserTripFromId(id, user_id) {
        try {
            if (user_id === id) {
                return await Trip.find({ "creator._id": user_id });
            }
            else return await Trip.find({ "creator._id": user_id, public: true });
        } catch (error) {
            throw error;
        }
    }
    static async getActivitiesFromGoogleAPI(id) {}

    static async getDirectionFromGoogleAPI(origin, destination, mode) {
        try {
            let response = await axios
                .get(
                    `${process.env.GOOGLE_API_URL}/directions/json?origin=${origin}&destination=${destination}&key=${process.env.GOOGLE_API_KEY}`
                )
                .then((res) => {
                    return res;
                });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getAirportsFromGoogleAPI(country) {
        try {
            let response = await axios
                .get(
                    `${process.env.GOOGLE_API_URL}/place/textsearch/json?query=${country}&type=airport&key=${process.env.GOOGLE_API_KEY}`
                )
                .then((res) => {
                    return res;
                });
            return response.data.results;
        } catch (error) {
            throw error;
        }
    }

    static async getHotelsFromGoogleAPI(place, radius) {
        try {
            let response = await axios
                .get(
                    `${process.env.GOOGLE_API_URL}/place/nearbysearch/json?location=${place}&radius=${radius}&type=lodging&rankby=prominence&key=${process.env.GOOGLE_API_KEY}`
                )
                .then((res) => {
                    return res;
                });
            return response.data.results;
        } catch (error) {
            throw error;
        }
    }

    static async getRestaurantsFromGoogleAPI(place, radius, minprice, maxprice) {
        try {
            let response = await axios
                .get(
                    `${process.env.GOOGLE_API_URL}/place/nearbysearch/json?location=${place}&radius=${radius}&type=restaurants&rankby=prominence&minprice=${minprice}&maxprice=${maxprice}&key=${process.env.GOOGLE_API_KEY}`
                )
                .then((res) => {
                    return res;
                });
            return response.data.results;
        } catch (error) {
            throw error;
        }
    }

    static async getBarsFromGoogleAPI(place, radius, minprice, maxprice) {
        try {
            let response = await axios
                .get(
                    `${process.env.GOOGLE_API_URL}/place/nearbysearch/json?location=${place}&radius=${radius}&type=bar&rankby=prominence&minprice=${minprice}&maxprice=${maxprice}&key=${process.env.GOOGLE_API_KEY}`
                )
                .then((res) => {
                    return res;
                });
            return response.data.results;
        } catch (error) {
            throw error;
        }
    }

    static async getTransportsFromGoogleAPI(place, radius) {
        try {
            let airports = await axios
                .get(`${process.env.GOOGLE_API_URL}/place/nearbysearch/json?location=${place}&radius=${radius}&type=airport&key=${process.env.GOOGLE_API_KEY}`)
                .then((res) => {
                    return res;
                });
            let car_rental = await axios
                .get(`${process.env.GOOGLE_API_URL}/place/nearbysearch/json?location=${place}&radius=${radius}&type=car_rental&key=${process.env.GOOGLE_API_KEY}`)
                .then((res) => {
                    return res;
                });
            let light_rail = await axios
                .get(`${process.env.GOOGLE_API_URL}/place/nearbysearch/json?location=${place}&radius=${radius}&type=light_rail_station&key=${process.env.GOOGLE_API_KEY}`)
                .then((res) => {
                    return res;
                });
            let subway = await axios
                .get(`${process.env.GOOGLE_API_URL}/place/nearbysearch/json?location=${place}&radius=${radius}&type=subway_station&key=${process.env.GOOGLE_API_KEY}`)
                .then((res) => {
                    return res;
                });
            let train = await axios
                .get(`${process.env.GOOGLE_API_URL}/place/nearbysearch/json?location=${place}&radius=${radius}&type=train_station&key=${process.env.GOOGLE_API_KEY}`)
                .then((res) => {
                    return res;
                });
            
            return {airports: airports.data.results,
                    car_rental: car_rental.data.results,
                    light_rail: light_rail.data.results,
                    subway: subway.data.results,
                    train: train.data.results}
        } catch (error) {
            throw error;
        }
    }

    static async getPOIFromAmadeusAPI(latitude, longitude, radius) {
        try {
            let token = await axios
                .post(
                    `${process.env.AMADEUS_API_URL}/security/oauth2/token`,
                    qs.stringify({
                        grant_type: 'client_credentials',
                        client_id: process.env.AMADEUS_API_KEY,
                        client_secret: process.env.AMADEUS_SECRET_KEY,
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            grant_type: 'client_credentials',
                            client_id: process.env.AMADEUS_API_KEY,
                            client_secret: process.env.AMADEUS_SECRET_KEY,
                        },
                    }
                )
                .then((res) => {
                    return res;
                });
            // console.log('token', token);

            let response = await axios
                .get(
                    `${process.env.AMADEUS_API_URL}/reference-data/locations/pois?latitude=${latitude}&longitude=${longitude}&radius=${radius}&page%5Blimit%5D=20&page%5Boffset%5D=0&categories=SIGHTS`,
                    {
                        headers: {
                            Authorization: `Bearer ${token.data.access_token}`,
                        },
                    }
                )
                .then((res) => {
                    return res;
                });
            //console.log('res', response.data)
            return response.data;
        } catch (error) {
            // console.log('error', error);
            throw error;
        }
    }

    static async getSpecificFromGoogleAPI(type, place, radius) {
        try {
            let response = await axios
                .get(
                    `${process.env.GOOGLE_API_URL}/place/nearbysearch/json?location=${place}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_API_KEY}`
                )
                .then((res) => {
                    return res;
                });
            return response.data.results;
        } catch (error) {
            // console.log('error', error)
            throw error;
        }
    }

    static async getPointsFromOpenTripMapApi(lat, lon, radius, kinds) {
        let url = `${process.env.OPENTRIPMAP_API_URL}/places/radius?radius=${radius}&lat=${lat}&lon=${lon}&apikey=${process.env.OPENTRIPMAP_API_TOKEN}`;
        if (kinds) {
            url += `&kinds=${kinds}`;
        }

        try {
            let response = await axios.get(url).then((res) => {
                return res;
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TripService;
