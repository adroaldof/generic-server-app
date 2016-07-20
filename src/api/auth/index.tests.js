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
            expect(err).to.not.exists;
            expect(user).to.exists;

            done();
        });
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
                    const answer = res.body.data;

                    expect(answer.user.name).to.equal(fullUser.name);
                    expect(answer.user.email).to.equal(fullUser.email);
                    expect(answer.user.mobileNumber).to.equal(fullUser.mobileNumber);

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
                    const answer = res.text;

                    expect(answer).to.contains('Redirecting');

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
                    const answer = res.body.data;

                    expect(answer.err).to.equal('No user found');

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
                    const answer = res.text;

                    expect(answer).to.contains('Welcome');

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
                    const answer = res.body.data;

                    expect(answer.err).to.equal('No user found');

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
                    const answer = res.text;

                    expect(answer).to.contains('Welcome');

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
                    expect(res).to.exists;

                    // Make logout request
                    request(app)
                        .get('/api/auth')
                        .set('Accept', 'application/json')
                        .then((res) => {
                            const answer = res.body;

                            expect(answer.info).to.equal('Successfully logged out');

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
                    expect(res).to.exists;

                    // Make logout request
                    request(app)
                        .get('/api/auth')
                        .then((res) => {
                            const answer = res.text;

                            expect(answer).to.contain('Redirecting');

                            done();
                        });
                });
        });
    })

});
