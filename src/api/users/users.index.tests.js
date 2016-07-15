/* globals describe, it */

import chai from 'chai';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import { expect } from 'chai';

import app from '../../index';


chai.config.includeStack = true;


describe('User APIs', () => {
    let user = {
        name: 'John Doe',
        email: 'test@gmail.com',
        mobileNumber: '4887658765'
    };

    describe('POST /api/users', () => {
        it('should create a new user', (done) => {
            request(app)
                .post('/api/users')
                .send(user)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal(user.name);
                    expect(res.body.email).to.equal(user.email);
                    expect(res.body.mobileNumber).to.equal(user.mobileNumber);
                    user = res.body;
                    done();
                }, (err) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('should not create an user if no email is supplied', (done) => {
            request(app)
                .post('/api/users')
                .send({
                    name: 'John Doe',
                    email: '',
                    mobileNumber: '1234567890'
                })
                .expect(httpStatus.BAD_REQUEST)
                .then(res => {
                    expect(res.body.message).to.contains(`"email" is not allowed to be empty`);
                    done();
                }, (err) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('should not create an user if no mobileNumber is supplied', (done) => {
            request(app)
                .post('/api/users')
                .send({
                    name: 'John Doe',
                    email: 'test@gmail.com',
                    mobileNumber: ''
                })
                .expect(httpStatus.BAD_REQUEST)
                .then(res => {
                    expect(res.body.message).to.contains(`"mobileNumber" is not allowed to be empty`);
                    done();
                }, (err) => {
                    expect(err).to.be.null;
                    done();
                });
        });

    });


    describe('GET /api/users/:userId', () => {
        it('should get user details', (done) => {
            request(app)
                .get(`/api/users/${ user._id }`)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal(user.name);
                    expect(res.body.mobileNumber).to.equal(user.mobileNumber);
                    done();
                }, (err) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('should report error with message, Not found, when user does not exists', (done) => {
            request(app)
                .get('/api/users/575e0308f7722f9771aaaaaa')
                .expect(httpStatus.NOT_FOUND)
                .then((res) => {
                    expect(res.body.message).to.equal('Not Found');
                    done();
                }, (err) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('should handle mongoose CastError - Cast to an wrong ObjectId', (done) => {
            request(app)
                .get('/api/users/56z787zzz67fc')
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
                .then((res) => {
                    expect(res.body.message).to.equal('Internal Server Error');
                    done();
                }, (err) => {
                    expect(err).to.be.null;
                    done();
                });
        });
    });

    describe('PUT /api/users/:userId', () => {
        it('should update user details', (done) => {
            user.name = 'John Doe Doe';

            request(app)
                .put(`/api/users/${ user._id }`)
                .send(user)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal('John Doe Doe');
                    expect(res.body.mobileNumber).to.equal(user.mobileNumber);
                    done();
                }, (err) => {
                    expect(err).to.be.null;
                    done();
                });
        });
    });


    describe('GET /api/users', () => {
        it('should get all users', (done) => {
            request(app)
                .get('/api/users')
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.equal('Password change succefully');
                    done();
                });
        });
    });


    describe('DELETE /api/users', () => {
        it('should delete an user', (done) => {
            request(app)
                .delete(`/api/users/${ user._id }`)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal('John Doe Doe');
                    expect(res.body.mobileNumber).to.equal(user.mobileNumber);
                    done();
                }, (err) => {
                    expect(err).to.be.null;
                    done();
                });
        });
    });
});
