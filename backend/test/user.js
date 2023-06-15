//During the test the env variable is set to test
require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'TEST_EpicRoadTrip';
process.env.API_URL = '/api/v1/users';

const User = require('../src/models/user');
const RefreshToken = require('../src/models/refresh-token');
let server = require('../src/app');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

let userToken = '';

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    /*beforeEach(function(done) {
            var newTodo = new Todo({
                text: 'Cook Indomie',
                status: true
            });
            newTodo.save(function(err) {
                done();
            });
        });*/
    afterEach((done) => {
        //Before each test we empty the databases
        User.deleteMany({}, (err) => {
            RefreshToken.deleteMany({}, (err) => {
                done();
            });
        });
    });

    /*
     * Test the /POST route
     */
    describe('/REGISTER user', () => {
        it('it should NOT REGISTER a user without username field', (done) => {
            let user = {
                password: 'testpwd',
                email: 'test@test.com',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT REGISTER a user without email field', (done) => {
            let user = {
                password: 'testpwd',
                username: 'epicroadtest',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT REGISTER a user without password field', (done) => {
            let user = {
                email: 'test@test.com',
                username: 'epicroadtest',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT REGISTER a user if email already exists', (done) => {
            let user = {
                email: 'test@test.com',
                username: 'epicroadtest',
                password: 'testpwd',
            };
            let user2 = {
                email: 'test@test.com',
                username: 'epicroadtest2',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);

                    chai.request(server)
                        .post(`${process.env.API_URL}/register`)
                        .send(user2)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.have.property('status').eql('error');
                            done();
                        });
                });
        });
        it('it should REGISTER a user ', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');
                    done();
                });
        });
    });
    /*
     * Test the /GET route
     */
    describe('/GET all users', () => {
        it('it should NOT GET users if token not provided', (done) => {
            chai.request(server)
                .get(`${process.env.API_URL}`)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should GET no users if db is empty', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    const user_id = res.body.data._id;
                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .delete(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('status').eql('success');

                                    chai.request(server)
                                        .get(`${process.env.API_URL}`)
                                        .set('Authorization', 'Bearer ' + token)
                                        .end((err, res) => {
                                            res.should.have.status(401);
                                            res.body.should.have.property('status').eql('error');
                                            done();
                                        });
                                });
                        });
                });
        });
        it('it should GET all users', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .get(`${process.env.API_URL}`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('status').eql('success');
                                    res.body.data.should.be.a('array');
                                    res.body.data.should.have.length(1);
                                    res.body.data[0].should.not.have.property('password');
                                    done();
                                });
                        });
                });
        });
        it('it should NOT GET users if token not valid', (done) => {
            chai.request(server)
                .get(`${process.env.API_URL}`)
                .set('Authorization', 'Bearer ' + ' ')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
    });
    /*
     * Test the /GET/me route
     */
    describe('/GET/me user', () => {
        it('it should NOT GET own user if no token provided', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .get(`${process.env.API_URL}/me`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(401);
                            res.body.should.have.property('status').eql('error');
                            res.body.should.have.property('message').eql('No token');
                            done();
                        });
                });
        });
        it('it should NOT GET own user if token invalid', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .get(`${process.env.API_URL}/me`)
                        .set('Authorization', 'Bearer ' + ' ')
                        .end((err, res) => {
                            res.should.have.status(401);
                            res.body.should.have.property('status').eql('error');
                            res.body.should.have.property('message').eql('Token not valid');
                            done();
                        });
                });
        });
        it('it should GET own user', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .get(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('username');
                                    res.body.should.have.property('email');
                                    res.body.should.not.have.property('password');
                                    done();
                                });
                        });
                });
        });
    });
    /*
     * Test the /GET/:id route
     */
    describe('/GET/:id user', () => {
        it('it should NOT GET user if id not a number', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .get(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('username');
                                    res.body.should.have.property('email');
                                    res.body.should.not.have.property('password');
                                    done();
                                });
                        });
                });
        });
        it('it should NOT GET user if token not provided', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .get(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('username');
                                    res.body.should.have.property('email');
                                    res.body.should.not.have.property('password');
                                    done();
                                });
                        });
                });
        });
        it('it should GET no user if user not exists', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .get(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('username');
                                    res.body.should.have.property('email');
                                    res.body.should.not.have.property('password');
                                    done();
                                });
                        });
                });
        });
        it('it should GET a user by the given id', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .get(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('username');
                                    res.body.should.have.property('email');
                                    res.body.should.not.have.property('password');
                                    done();
                                });
                        });
                });
        });
        it('it should NOT GET user if token not valid', (done) => {
            chai.request(server)
                .get(`${process.env.API_URL}`)
                .set('Authorization', 'Bearer ' + ' ')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
    });
    /*
     * Test the /PUT route
     */
    describe('/PUT/me user', () => {
        it('it should NOT UPDATE user if no token', (done) => {
            chai.request(server)
                .put(`${process.env.API_URL}/me`)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        /*it('it should NOT UPDATE user if id in token not same as params', (done) => {
            let user = {
                username: "epicroadtest",
                email: "test@test.com",
                password: "testpwd",
            }
            chai.request(server)
            .post(`${process.env.API_URL}/register`)
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.data.should.have.property('username');
                res.body.data.should.have.property('email');
                res.body.data.should.not.have.property('password');

                chai.request(server)
                .post(`${process.env.API_URL}/login`)
                .send(user)
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.data.should.have.property('jwtToken');
                        res.body.data.should.have.property('refreshToken');

                        var token = res.body.data.jwtToken
                            
                            chai.request(server)
                            .put(`${process.env.API_URL}/me`)
                            .set('Authorization', 'Bearer ' + token)
                            .end((err, res) => {
                                // console.log('res', res.body)
                                res.should.have.status(404);
                                res.body.should.have.property('status').eql('error')
                            done();
                        });
                        
                });
            });
        });*/
        it('it should NOT UPDATE user if user does not exist', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    const user_id = res.body.data._id;

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .delete(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('status').eql('success');

                                    chai.request(server)
                                        .put(`${process.env.API_URL}/me`)
                                        .set('Authorization', 'Bearer ' + token)
                                        .send(user)
                                        .end((err, res) => {
                                            res.should.have.status(401);
                                            res.body.should.have.property('status').eql('error');
                                            done();
                                        });
                                });
                        });
                });
        });
        it('it should NOT UPDATE user if token not valid', (done) => {
            chai.request(server)
                .put(`${process.env.API_URL}/me`)
                .set('Authorization', 'Bearer ' + ' ')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should UPDATE user', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    let user_id = res.body.data._id;

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .put(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + token)
                                .send({ username: 'epicupdate' })
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.data.should.have.property('username').eql('epicupdate');
                                    res.body.data.should.have.property('email');
                                    res.body.data.should.not.have.property('password');
                                    done();
                                });
                        });
                });
        });
    });
    /*
     * Test the /DELETE/:id route
     */
    describe('/DELETE/:id user', () => {
        it('it should NOT DELETE a user if no token provided', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    const user_id = res.body.data._id;

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .delete(`${process.env.API_URL}/me`)
                                .end((err, res) => {
                                    res.should.have.status(401);
                                    res.body.should.have.property('status').eql('error');

                                    done();
                                });
                        });
                });
        });
        it('it should NOT DELETE a user if token invalid', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    const user_id = res.body.data._id;

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .delete(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + ' ')
                                .end((err, res) => {
                                    res.should.have.status(401);
                                    res.body.should.have.property('status').eql('error');

                                    done();
                                });
                        });
                });
        });
        it('it should NOT DELETE a user if user does not exist', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    const user_id = res.body.data._id;

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            const token = res.body.data.jwtToken;

                            chai.request(server)
                                .delete(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('status').eql('success');

                                    chai.request(server)
                                        .delete(`${process.env.API_URL}/me`)
                                        .set('Authorization', 'Bearer ' + token)
                                        .end((err, res) => {
                                            res.should.have.status(401);
                                            res.body.should.have.property('status').eql('error');
                                            done();
                                        });
                                });
                        });
                });
        });
        it('it should DELETE a user', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    const user_id = res.body.data._id;

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .delete(`${process.env.API_URL}/me`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('status').eql('success');

                                    done();
                                });
                        });
                });
        });
    });
    /*
     * Test the /login route
     */
    describe('/login user', () => {
        it('it should NOT LOGIN if no username or email provided', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: undefined, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(422);
                            res.body.should.have.property('status').eql('error');
                            done();
                        });
                });
        });
        it('it should NOT LOGIN if no password provided', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    user.password = undefined;

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(422);
                            res.body.should.have.property('status').eql('error');
                            done();
                        });
                });
        });
        it('it should LOGIN if username and password provided', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');
                            done();
                        });
                });
        });
        it('it should LOGIN if email and password provided', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.email, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');
                            done();
                        });
                });
        });
    });
    /*
     * Test the /refresh-token route
     */
    describe('/refresh-token user', () => {
        it('it should NOT REFRESH token if no refresh token provided', (done) => {
            let user = {
                login: 'epicroadtest',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/refresh-token`)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should NOT REFRESH token if refresh token invalid', (done) => {
            chai.request(server)
                .post(`${process.env.API_URL}/refresh-token`)
                .send({ refreshToken: ' ' })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });
        it('it should REFRESH token', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.refreshToken;

                            chai.request(server)
                                .post(`${process.env.API_URL}/refresh-token`)
                                .send({ refreshToken: token })
                                .end((err, res) => {
                                    res.should.have.status(201);
                                    res.body.should.have.property('status').eql('success');
                                    res.body.data.should.have.property('jwtToken');
                                    res.body.data.should.have.property('refreshToken');
                                    done();
                                });
                        });
                });
        });
    });
    /*
     * Test the /disconnect route
     */
    describe('/disconnect user', () => {
        it('it should NOT DELETE a user if token not provided', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    const user_id = res.body.data._id;

                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .post(`${process.env.API_URL}/disconnect`)
                                .end((err, res) => {
                                    res.should.have.status(401);
                                    res.body.should.have.property('status').eql('error');

                                    done();
                                });
                        });
                });
        });
        it('it should NOT DELETE a user if token not valid', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    const user_id = res.body.data._id;
                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .post(`${process.env.API_URL}/disconnect`)
                                .set('Authorization', 'Bearer ' + ' ')
                                .end((err, res) => {
                                    res.should.have.status(401);
                                    res.body.should.have.property('status').eql('error');

                                    done();
                                });
                        });
                });
        });
        it('it should DELETE a user given the id', (done) => {
            let user = {
                username: 'epicroadtest',
                email: 'test@test.com',
                password: 'testpwd',
            };
            chai.request(server)
                .post(`${process.env.API_URL}/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('username');
                    res.body.data.should.have.property('email');
                    res.body.data.should.not.have.property('password');

                    const user_id = res.body.data._id;
                    let = userToLogin = { login: user.username, password: user.password };

                    chai.request(server)
                        .post(`${process.env.API_URL}/login`)
                        .send(userToLogin)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.data.should.have.property('jwtToken');
                            res.body.data.should.have.property('refreshToken');

                            var token = res.body.data.jwtToken;

                            chai.request(server)
                                .post(`${process.env.API_URL}/disconnect`)
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('status').eql('success');

                                    done();
                                });
                        });
                });
        });
    });
});
