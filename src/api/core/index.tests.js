/* globals describe, it */

import chai from 'chai';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import { expect } from 'chai';

import app from '../../index';
import User from '../users/model';


chai.config.includeStack = true;

describe('Core Tests', () => {
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


    describe('GET /', () => {
        it('should retrieve index page', (done) => {
            request(app)
                .get('/')
                .accept('application/json')
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.info).to.equal('Successfully got index');

                    done();
                });
        });


        it('should retrieve index page', (done) => {
            request(app)
                .get('/')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.text;

                    expect(answer).to.contains('Generic');

                    done();
                });
        });
    });


    describe('POST /login', () => {
        it('should authenticate an user', (done) => {
            const credentials = {
                email: fullUser.email,
                password: fullUser.password
            }

            request(app)
                .post('/login')
                .accept('application/json')
                .send(credentials)
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data.user;

                    expect(answer.name).to.contains(fullUser.name);
                    expect(answer.email).to.contains(fullUser.email);
                    expect(answer.mobileNumber).to.contains(fullUser.mobileNumber);

                    done();
                });
        });


        it('should not authenticate an user whith wrong password', (done) => {
            const credentials = {
                email: fullUser.email,
                password: 'password'
            }

            request(app)
                .post('/login')
                .accept('application/json')
                .send(credentials)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.err).to.equal('No user found');

                    done();
                });
        });


        it('should not authenticate an user whith wrong email', (done) => {
            const credentials = {
                email: 'jonh@doe.com',
                password: fullUser.password
            }

            request(app)
                .post('/login')
                .accept('application/json')
                .send(credentials)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.err).to.equal('No user found');

                    done();
                });
        });
    });


    describe('GET /logout', () => {
        it('should lougout an user', (done) => {
            const credentials = {
                email: fullUser.email,
                password: fullUser.password
            }

            request(app)
                .post('/login')
                .accept('application/json')
                .send(credentials)
                .then((res) => {
                    expect(res).to.exists;

                    // Make logout request
                    request(app)
                        .get('/logout')
                        .accept('application/json')
                        .then((res) => {
                            const answer = res.body;

                            expect(answer.info).to.equal('Successfully logged out');

                            done();
                        });
                });
        });
    })


	describe('GET /json', () => {
		it('should return system ok object message', (done) => {
			request(app)
				.get('/json')
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.system).to.equal('OK');
                    expect(res.body.info).to.equal('System is up');
					done();
				});
		});
	});

    describe('POST /json', () => {
        it('should post system ok object message', (done) => {
            request(app)
                .post('/json')
                .send({
                    info: 'Sent something'
                })
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.system).to.equal('OK');
                    expect(res.body.info).to.equal('Sent something');
                    done();
                });
        });
    });


	describe('GET /api/404', () => {
		it('should return 404 status', (done) => {
			request(app)
				.get('/api/unknown')
				.expect(httpStatus.NOT_FOUND)
				.then(res => {
					expect(res.body.message).to.equal('Not Found');
					done();
				});
		});
	});

});
