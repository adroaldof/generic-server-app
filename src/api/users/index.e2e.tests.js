/* eslint-disable no-unused-expressions */

import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import { expect } from 'chai';

import app from '../../index';
import User from './model';


describe(':: User APIs ::', () => {
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
                .accept('application/json')
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    const answer = res.body;

                    expect(answer).to.exists;
                    expect(answer).to.an.object;
                    expect(answer.message).to.equal('"email" is required');

                    done();
                });
        });


        it('should not create a user if no password is supplied', (done) => {
            delete fullUser.password;

            request(app)
                .post('/api/users')
                .send(fullUser)
                .accept('application/json')
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    const answer = res.body;

                    expect(answer).to.exists;
                    expect(answer).to.an.object;
                    expect(answer.message).to.equal('"password" is required');

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
                .accept('application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.user.id).to.exists;
                    expect(answer.user.email).to.equal(fullUser.email);

                    done();
                });
        });


        it('should create a new user with all properties set', (done) => {
            request(app)
                .post('/api/users')
                .send(fullUser)
                .accept('application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.user.id).to.exists;
                    expect(answer.user.name).to.equal(fullUser.name);
                    expect(answer.user.email).to.equal(fullUser.email);
                    expect(answer.user.mobileNumber).to.equal(fullUser.mobileNumber);

                    savedUser = answer.user;
                    savedUser.id = answer.user._id; // eslint-disable-line no-underscore-dangle

                    done();
                });
        });


        it('should not create a user with duplicated email', (done) => {
            request(app)
                .post('/api/users')
                .send(fullUser)
                .accept('application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer).to.exists;
                    expect(answer.err.code).to.equal(11000);
                    expect(answer.err.errmsg).to.contains('duplicate');
                    expect(answer.err.errmsg).to.contains('email');

                    done();
                });
        });
    });


    describe('GET /api/users', () => {
        it('should get all users', (done) => {
            request(app)
                .get('/api/users')
                .accept('application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.users).to.be.an.object;
                    expect(answer.users.length).to.be.above(0);

                    done();
                });
        });
    });


    describe('GET /api/users/:id', () => {
        it('should get user details', (done) => {
            request(app)
                .get(`/api/users/${ savedUser.id }`)
                .accept('application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.user.name).to.equal(savedUser.name);
                    expect(answer.user.email).to.equal(savedUser.email);
                    expect(answer.user.mobileNumber).to.equal(savedUser.mobileNumber);

                    done();
                });
        });


        it('should report error with message, Not found, when user does not exists', (done) => {
            request(app)
                .get('/api/users/575e0308f7722f9771aaaaaa')
                .accept('application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data.err;

                    expect(answer.name).to.equal('Error');
                    expect(answer.info).to.equal('No such user found!');

                    done();
                });
        });


        it('should handle mongoose CastError - Cast to an wrong ObjectId', (done) => {
            request(app)
                .get('/api/users/56z787zzz67fc')
                .accept('application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data.err;

                    expect(answer.name).to.equal('CastError');
                    expect(answer.kind).to.equal('ObjectId');
                    expect(answer.message).to.contains('Cast to ObjectId failed');

                    done();
                });
        });
    });


    describe('PUT /api/users/:id/update', () => {
        it('should update user details', (done) => {
            savedUser.name = 'John Doe Doe';

            request(app)
                .put(`/api/users/${ savedUser.id }/update`)
                .send(savedUser)
                .accept('application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.user.name).to.equal('John Doe Doe');
                    expect(answer.user.email).to.equal(savedUser.email);
                    expect(answer.user.mobileNumber).to.equal(savedUser.mobileNumber);

                    done();
                });
        });
    });


    describe('GET /api/users/:id/password', () => {
        it('should change user password', (done) => {
            const updateInfo = {
                password: 'Passw0rd',
                newPassword: 'NewPassw0rd'
            };

            request(app)
                .put(`/api/users/${ savedUser.id }/password`)
                .send(updateInfo)
                .accept('application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body;

                    expect(answer.info.success).to.be.true;
                    expect(answer.info.message).to.equal('Password changed successfully');

                    done();
                });
        });
    });


    describe('DELETE /api/users', () => {
        it('should delete an user', (done) => {
            request(app)
                .delete(`/api/users/${ savedUser.id }/remove`)
                .accept('application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body;

                    expect(answer.info.success).to.be.true;
                    expect(answer.info.message).to.equal('User removed successfully');

                    done();
                });
        });
    });
});
