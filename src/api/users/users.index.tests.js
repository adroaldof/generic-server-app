/* globals describe, it */

import chai from 'chai';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import { expect } from 'chai';

import app from '../../index';
import User from './users.model';


chai.config.includeStack = true;

describe('User APIs', () => {
    let fullUser = {};
    let savedUser = {};

    function clearUsers (done) {
        User.remove({}, done);
    }

    before((done) => clearUsers(done));

    after((done) => clearUsers(done));

    beforeEach(() => {
        fullUser = {
            name: 'John Doe',
            email: 'john-doe@gmail.com',
            mobileNumber: '4887658765',
            password: 'Passw0rd'
        };
    });

    describe('POST /api/users', () => {
        it('should not create a user if no email is supplied', (done) => {
            delete fullUser.email;

            request(app)
                .post('/api/users')
                .send(fullUser)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
                .then((err) => {
                    const error = JSON.parse(err.error.text);

                    expect(err).to.exists;
                    expect(error.message).to.equal('Internal Server Error');
                    done();
                });
        });


        it('should not create a user if no password is supplied', (done) => {
            delete fullUser.password;

            request(app)
                .post('/api/users')
                .send(fullUser)
                .expect(httpStatus.NOT_FOUND)
                .then((err) => {
                    const error = err.body;

                    expect(err).to.exists;
                    expect(error.message).to.equal('Not Found');
                    done();
                });
        });


        it('should create a new user with just email and password', (done) => {
            delete fullUser.name;
            delete fullUser.mobileNumber;

            fullUser.email = 'john@doe.com';

            request(app)
                .post('/api/users')
                .send(fullUser)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal(fullUser.name);
                    expect(res.body.email).to.equal(fullUser.email);
                    expect(res.body.mobileNumber).to.equal(fullUser.mobileNumber);
                    done();
                });
        });


        it('should create a new user with all properties set', (done) => {
            request(app)
                .post('/api/users')
                .send(fullUser)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal(fullUser.name);
                    expect(res.body.email).to.equal(fullUser.email);
                    expect(res.body.mobileNumber).to.equal(fullUser.mobileNumber);

                    savedUser = res.body;
                    done();
                });
        });


        it('should not create a user with duplicated email', (done) => {
            request(app)
                .post('/api/users')
                .send(fullUser)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
                .then((err) => {
                    const error = err.body;

                    expect(err).to.exists;
                    expect(error.message).to.equal('Internal Server Error');
                    done();
                });
        });

    });


    describe('GET /api/users',  () => {
        it('should get all users', (done) => {
            request(app)
                .get(`/api/users`)
                .expect(httpStatus.OK)
                .then((res) => {
                    const users = res.body;

                    expect(users).to.be.an.object;
                    expect(users.length).to.be.above(0);
                    done();
                });
        });
    });


    describe('GET /api/users/:userId', () => {
        it('should get user details', (done) => {
            request(app)
                .get(`/api/users/${ savedUser._id }`)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal(savedUser.name);
                    expect(res.body.email).to.equal(savedUser.email);
                    expect(res.body.mobileNumber).to.equal(savedUser.mobileNumber);
                    done();
                });
        });


        it('should report error with message, Not found, when user does not exists', (done) => {
            request(app)
                .get('/api/users/575e0308f7722f9771aaaaaa')
                .expect(httpStatus.NOT_FOUND)
                .then((err) => {
                    expect(err.body.message).to.equal('Not Found');
                    done();
                });
        });


        it('should handle mongoose CastError - Cast to an wrong ObjectId', (done) => {
            request(app)
                .get('/api/users/56z787zzz67fc')
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
                .then((err) => {
                    expect(err.body.message).to.equal('Internal Server Error');
                    done();
                });
        });
    });


    describe('PUT /api/users/:userId', () => {
        it('should update user details', (done) => {
            savedUser.name = 'John Doe Doe';

            request(app)
                .put(`/api/users/${ savedUser._id }`)
                .send(savedUser)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal('John Doe Doe');
                    expect(res.body.email).to.equal(savedUser.email);
                    expect(res.body.mobileNumber).to.equal(savedUser.mobileNumber);
                    done();
                });
        });
    });


    describe('GET /api/users/:userId/change-password', () => {
        it('should change user password', (done) => {
            const updateInfo = {
                password: 'Passw0rd',
                newPassword: 'NewPassw0rd'
            };

            request(app)
                .put(`/api/users/${ savedUser._id }/change-password`)
                .send(updateInfo)
                .then((res) => {
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.equal('Password change succefully');
                    done();
                });
        })
    });


    describe('DELETE /api/users', () => {
        it('should delete an user', (done) => {
            request(app)
                .delete(`/api/users/${ savedUser._id }`)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal('John Doe Doe');
                    expect(res.body.email).to.equal(savedUser.email);
                    expect(res.body.mobileNumber).to.equal(savedUser.mobileNumber);
                    done();
                });
        });
    });
});
