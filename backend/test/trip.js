//During the test the env variable is set to test
require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'TEST_EpicRoadTrip';
const API_URL = '/api/v1/trips';

const { Trip, RoadPoint, Event } = require('../src/models/trip');
const User = require('../src/models/user');

const TripService = require('../src/services/TripService');

const RefreshToken = require('../src/models/refresh-token');
let server = require('../src/app');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block

describe('Trips', () => {
    let token = '';
    /*beforeEach(function(done) {
            var newTodo = new Todo({
                text: 'Cook Indomie',
                status: true
            });
            newTodo.save(function(err) {
                done();
            });
        });*/
    before((done) => {
        let user = {
            username: 'epicroadtest',
            email: 'test@test.com',
            password: 'testpwd',
        };
        chai.request(server)
            .post(`${process.env.API_URL}/register`)
            .send(user)
            .end((err, res) => {
                let = userToLogin = { login: user.username, password: user.password };

                chai.request(server)
                    .post(`${process.env.API_URL}/login`)
                    .send(userToLogin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.data.should.have.property('jwtToken');
                        res.body.data.should.have.property('refreshToken');

                        token = res.body.data.jwtToken;

                        done();
                    });
            });
    });
    afterEach((done) => {
        //Before each test we empty the databases
        Trip.deleteMany({}, (err) => {
            RefreshToken.deleteMany({}, (err) => {
                done();
            });
        });
    });

    /*
     * Test the /GET route
     */
    describe('/GET all trips', () => {
        it('it should NOT GET trips if no founds', (done) => {
            chai.request(server)
                .get(`${API_URL}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should  GET trips if founds', (done) => {
            let body = {
                itinerary: [
                    {
                        event: [
                            {
                                name: 'MagDo',
                                description: 'BigMag',
                                position: {
                                    lat: 37.76999,
                                    lon: -122.44696,
                                },
                            },
                        ],
                        country: 'Australia',
                        city: 'Sidney',
                        postalcode: 0,
                        position: {
                            lat: 37.76999,
                            lon: -122.44696,
                        },
                    },
                ],
                is_public: true,
            };

            chai.request(server)
                .post(`${API_URL}`)
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('object').that.is.not.empty;

                    chai.request(server)
                        .get(`${API_URL}/`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('status').eql('success');
                            res.body.should.have.property('data').to.be.an('array').that.is.not.empty;
                            done();
                        });
                });
        });
    });
    /*
     * Test the /GET route
     */
    describe('/GET:id trip', () => {
        it('it should NOT GET trip if not found', (done) => {
            chai.request(server)
                .get(`${API_URL}/60e9caa57b3833b09574d7ca`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should  GET trip if found', (done) => {
            let body = {
                itinerary: [
                    {
                        event: [
                            {
                                name: 'MagDo',
                                description: 'BigMag',
                                position: {
                                    lat: 37.76999,
                                    lon: -122.44696,
                                },
                            },
                        ],
                        country: 'Australia',
                        city: 'Sidney',
                        postalcode: 0,
                        position: {
                            lat: 37.76999,
                            lon: -122.44696,
                        },
                    },
                ],
                is_public: true,
            };

            chai.request(server)
                .post(`${API_URL}`)
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('object').that.is.not.empty;

                    chai.request(server)
                        .get(`${API_URL}/${res.body.data.sharingcode}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('status').eql('success');
                            res.body.should.have.property('data').to.be.an('object').that.is.not.empty;
                            done();
                        });
                });
        });
    });

    /*
     * Test the /POST route
     */
    describe('/POST trip', () => {
        it('it should NOT POST trip if not connected', (done) => {
            chai.request(server)
                .post(`${API_URL}/`)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });

        it('it should NOT POST trip if itinerary not provided', (done) => {
            chai.request(server)
                .post(`${API_URL}/`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT POST trip if itinerary.event not provided', (done) => {
            let body = {
                itinerary: [
                    {
                        country: 'Australia',
                        city: 'Sidney',
                        postalcode: 0,
                        position: {
                            lat: 37.76999,
                            lon: -122.44696,
                        },
                    },
                ],
            };
            chai.request(server)
                .post(`${API_URL}`)
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });

        it('it should NOT POST trip if itinerary.position not provided', (done) => {
            let body = {
                itinerary: [
                    {
                        event: [
                            {
                                name: 'MagDo',
                                description: 'BigMag',
                                position: {
                                    lat: 37.76999,
                                    lon: -122.44696,
                                },
                            },
                        ],
                        country: '',
                        city: 'Sidney',
                    },
                ],
            };
            chai.request(server)
                .post(`${API_URL}`)
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });

        it('it should NOT POST trip if itinerary.position.event.name not provided', (done) => {
            let body = {
                itinerary: [
                    {
                        event: [
                            {
                                description: 'BigMag',
                                position: {
                                    lat: 37.76999,
                                    lon: -122.44696,
                                },
                            },
                        ],
                        country: '',
                        city: 'Sidney',
                        position: {
                            lat: 37.76999,
                            lon: -122.44696,
                        },
                    },
                ],
            };
            chai.request(server)
                .post(`${API_URL}`)
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });

        it('it should NOT POST trip if itinerary.position.event.position not provided', (done) => {
            let body = {
                itinerary: [
                    {
                        event: [
                            {
                                name: 'MagDo',
                            },
                        ],
                        country: '',
                        city: 'Sidney',
                        position: {
                            lat: 37.76999,
                            lon: -122.44696,
                        },
                    },
                ],
            };
            chai.request(server)
                .post(`${API_URL}`)
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });

        it('it should POST trip if connected', (done) => {
            let body = {
                itinerary: [
                    {
                        event: [
                            {
                                name: 'MagDo',
                                description: 'BigMag',
                                position: {
                                    lat: 37.76999,
                                    lon: -122.44696,
                                },
                            },
                        ],
                        country: 'Australia',
                        city: 'Sidney',
                        postalcode: 0,
                        position: {
                            lat: 37.76999,
                            lon: -122.44696,
                        },
                    },
                ],
            };
            chai.request(server)
                .post(`${API_URL}`)
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('object').that.is.not.empty;
                    done();
                });
        });
    });

    /*
     * Test the /DELETE route
     */
    describe('/DELETE trip', () => {
        it('it should NOT DELETE trip if not connected', (done) => {
            chai.request(server)
                .delete(`${API_URL}/60e9caa57b3833b09574d7ca`)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT DELETE trip if not found', (done) => {
            chai.request(server)
                .delete(`${API_URL}/60e9caa57b3833b09574d7ca`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should DELETE trip if found', (done) => {
            let body = {
                itinerary: [
                    {
                        event: [
                            {
                                name: 'MagDo',
                                description: 'BigMag',
                                position: {
                                    lat: 37.76999,
                                    lon: -122.44696,
                                },
                            },
                        ],
                        country: 'Australia',
                        city: 'Sidney',
                        postalcode: 0,
                        position: {
                            lat: 37.76999,
                            lon: -122.44696,
                        },
                    },
                ],
                is_public: true,
            };

            chai.request(server)
                .post(`${API_URL}`)
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('object').that.is.not.empty;

                    chai.request(server)
                        .delete(`${API_URL}/${res.body.data.sharingcode}`)
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('status').eql('success');
                            done();
                        });
                });
        });
    });

    /*
     * Test the /GET user's trip route
     */
    describe("/GET user's trip", () => {
        it('it should NOT GET trip if not connected', (done) => {
            chai.request(server)
                .get(`${API_URL}/user/60e9caa57b3833b09574d7ca`)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET trip if not found', (done) => {
            chai.request(server)
                .get(`${API_URL}/user/50e9caa57a3813b09574d7ca`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should GET trip if found', (done) => {
            let body = {
                itinerary: [
                    {
                        event: [
                            {
                                name: 'MagDo',
                                description: 'BigMag',
                                position: {
                                    lat: 37.76999,
                                    lon: -122.44696,
                                },
                            },
                        ],
                        country: 'Australia',
                        city: 'Sidney',
                        postalcode: 0,
                        position: {
                            lat: 37.76999,
                            lon: -122.44696,
                        },
                    },
                ],
                is_public: true,
            };

            chai.request(server)
                .post(`${API_URL}`)
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('object').that.is.not.empty;

                    chai.request(server)
                        .get(`${API_URL}/user/${res.body.data.creator._id}`)
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('status').eql('success');
                            res.body.should.have.property('data').to.be.an('array').that.is.not.empty;
                            done();
                        });
                });
        });
    });

    /*
     * Test the /GET user's trip route from Google API
     */
    describe('/GET direction from Google API', () => {
        it('it should NOT GET direction if impossible by earth', (done) => {
            chai.request(server)
                .get(`${API_URL}/directions?origin=france&destination=san francisco`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET direction if origin not provided', (done) => {
            chai.request(server)
                .get(`${API_URL}/directions?destination=paris`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET direction if destination not provided', (done) => {
            chai.request(server)
                .get(`${API_URL}/directions?origin=paris`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should GET direction if found', (done) => {
            chai.request(server)
                .get(`${API_URL}/directions?origin=paris&destination=brussels`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('object').that.is.not.empty;
                    done();
                });
        });
    });

    /*
     * Test the /GET accomodations from Google API
     */
    describe('/GET accomodations from Google API', () => {
        it('it should NOT GET accomodations if no query params place found', (done) => {
            chai.request(server)
                .get(`${API_URL}/hotels`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET accomodations if place is not of type lat,lon', (done) => {
            chai.request(server)
                .get(`${API_URL}/hotels?place=aaa,aaa`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET accomodations if not found', (done) => {
            chai.request(server)
                .get(`${API_URL}/hotels?place=37.76999,-122.44696&radius=0`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should GET accomodations if found', (done) => {
            chai.request(server)
                .get(`${API_URL}/hotels?place=37.76999,-122.44696&radius=2500`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('array').that.is.not.empty;
                    done();
                });
        });
    });

    /*
     * Test the /GET restaurants from Google API
     */
    describe('/GET restaurants from Google API', () => {
        it('it should NOT GET restaurants if no query params place found', (done) => {
            chai.request(server)
                .get(`${API_URL}/restaurants`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET restaurants if place is not of type lat,lon', (done) => {
            chai.request(server)
                .get(`${API_URL}/restaurants?place=aaa,aaa`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET restaurants if not found', (done) => {
            chai.request(server)
                .get(`${API_URL}/restaurants?place=37.76999,-122.44696&radius=0`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should GET restaurants if found', (done) => {
            chai.request(server)
                .get(`${API_URL}/restaurants?place=37.76999,-122.44696&radius=2500`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('array').that.is.not.empty;
                    done();
                });
        });
    });

    /*
     * Test the /GET bars from Google API
     */
    describe('/GET bars from Google API', () => {
        it('it should NOT GET bars if no query params place found', (done) => {
            chai.request(server)
                .get(`${API_URL}/bars`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET bars if place is not of type lat,lon', (done) => {
            chai.request(server)
                .get(`${API_URL}/bars?place=aaa,aaa`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET bars if not found', (done) => {
            chai.request(server)
                .get(`${API_URL}/bars?place=37.76999,-122.44696&radius=0`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should GET bars if found', (done) => {
            chai.request(server)
                .get(`${API_URL}/bars?place=37.76999,-122.44696&radius=2500`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('array').that.is.not.empty;
                    done();
                });
        });
    });

    /*
     * Test the /GET transports from Google API
     */
    describe('/GET transports from Google API', () => {
        it('it should NOT GET transports if no query params place found', (done) => {
            chai.request(server)
                .get(`${API_URL}/transports`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET transports if place is not of type lat,lon', (done) => {
            chai.request(server)
                .get(`${API_URL}/transports?place=aaa,aaa`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT GET transports if not found', (done) => {
            chai.request(server)
                .get(`${API_URL}/transports?place=37.76999,-122.44696&radius=0`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should GET transports if found', (done) => {
            chai.request(server)
                .get(`${API_URL}/transports?place=37.76999,-122.44696&radius=2500`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('array').that.is.not.empty;
                    done();
                });
        });
    });

    /*
     * Test the /GET poi from open trip map
     */
    describe('/GET otm trip', () => {
        it('it should NOT GET open trip map poi if not found', (done) => {
            chai.request(server)
                .get(`${API_URL}/`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });

        it('it should NOT GET open trip map poi if lat or lon is not present', (done) => {
            chai.request(server)
                .get(`${API_URL}/otm/poi`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });

        it('it should NOT GET open trip map poi if lon or lat is bad paras', (done) => {
            chai.request(server)
                .get(`${API_URL}/otm/poi?lon=aaa&lat=aaa`)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });

        it('it should NOT GET open trip map poi if kinds not exist params', (done) => {
            let kinds = 'aaa';
            chai.request(server)
                .get(`${API_URL}/otm/poi?lat=48.5833&lon=7.75&kinds=${kinds}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status').eql('error');
                    res.body.should.have.property('message').eql(`Unknown category name: ${kinds}`);
                    done();
                });
        });

        it('it should GET open trip map poi if found', (done) => {
            chai.request(server)
                .get(`${API_URL}/otm/poi?lat=48.5833&lon=7.75`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data').to.be.an('array').that.is.not.empty;
                    done();
                });
        });
    });
});
