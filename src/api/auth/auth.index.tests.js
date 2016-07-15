/* globals describe, it */

import chai from 'chai';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import { expect } from 'chai';

import app from '../../index';
import User from '../users/users.model';


chai.config.includeStack = true;

describe('Auth API Tests', () => {
    let fullUser = {};

    function clearUsers (done) {
        User.remove({}, done);
    }

    before((done) => clearUsers(done));

    after((done) => clearUsers(done));

    before((done) => {
        fullUser = {
            name: 'John Doe',
            email: 'john-doe@gmail.com',
            mobileNumber: '4887658765',
            password: 'Passw0rd'
        };

        User.register(fullUser, (err, user) => {
            done();
        })
    });

    describe('POST /api/auth', () => {
        it('should authenticate an user', (done) => {
            const credentials = {
                email: fullUser.email,
                password: fullUser.password
            }

            request(app)
                .post('/api/auth')
                .set('Accept', 'application/json')
                .send(credentials)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const user = res.body;

                    expect(user.name).to.equal(fullUser.name);
                    expect(user.email).to.equal(fullUser.email);
                    expect(user.mobileNumber).to.equal(fullUser.mobileNumber);
                    done();
                });
        });


        it('should authenticate an user on HTML mode', (done) => {
            const credentials = {
                email: fullUser.email,
                password: fullUser.password
            }

            request(app)
                .post('/api/auth')
                .send(credentials)
                .expect(httpStatus.FOUND)
                .then((res) => {
                    expect(res.text).to.contains('user-info');
                    done();
                });
        });


        it('should not authenticate an user whith wrong password', (done) => {
            const credentials = {
                email: fullUser.email,
                password: 'password'
            }

            request(app)
                .post('/api/auth')
                .set('Accept', 'application/json')
                .send(credentials)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const err = res.body;

                    expect(err.error).to.equal('No user found');
                    done();
                });
        });


        it('should not authenticate an user whith wrong password on HTML mode', (done) => {
            const credentials = {
                email: fullUser.email,
                password: 'password'
            }

            request(app)
                .post('/api/auth')
                .send(credentials)
                .then((res) => {
                    expect(res.text).to.contains('Welcome');
                    done();
                });
        });

        it('should not authenticate an user whith wrong email', (done) => {
            const credentials = {
                email: 'jonh@doe.com',
                password: fullUser.password
            }

            request(app)
                .post('/api/auth')
                .set('Accept', 'application/json')
                .send(credentials)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const err = res.body;

                    expect(err.error).to.equal('No user found');
                    done();
                });
        });

        it('should not authenticate an user whith wrong email on HTML mode', (done) => {
            const credentials = {
                email: 'jonh@doe.com',
                password: fullUser.password
            }

            request(app)
                .post('/api/auth')
                .send(credentials)
                .then((res) => {
                    expect(res.text).to.contains('Welcome');
                    done();
                });
        });
    });

    describe('GET /api/auth', () => {
        it('should lougout an user', (done) => {
            const credentials = {
                email: fullUser.email,
                password: fullUser.password
            }

            request(app)
                .post('/api/auth')
                .set('Accept', 'application/json')
                .send(credentials)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    // Make logout request
                    request(app)
                        .get('/api/auth')
                        .set('Accept', 'application/json')
                        .then((res) => {
                            expect(res.body.info).to.equal('Success logged out');
                            done();
                        });
                });
        });


        it('should lougout an user on HTML mode', (done) => {
            const credentials = {
                email: fullUser.email,
                password: fullUser.password
            }

            request(app)
                .post('/api/auth')
                .send(credentials)
                .then((res) => {
                    // Make logout request
                    request(app)
                        .get('/api/auth')
                        .then((res) => {
                            expect(res.text).to.contain('Welcome');
                            done();
                        });
                });
        });
    })

});
