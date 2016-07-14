/* globals describe, it */

import _ from 'lodash';
import sinon from 'sinon';
import { expect } from 'chai';


import User from './users.model';


describe('User Model Tests', () => {

    let userInfo = {
        email: 'test-user@gmail.com',
        password: 'Passw0rd'
    };

    afterEach(() => {
        userInfo = {
            email: 'test-user@gmail.com',
            password: 'Passw0rd'
        };
    })

    describe('Make User validations', () => {

        it('should not validate an user if no email is supplied', (done) => {
            delete userInfo.email;
            const user = User(userInfo);

            user.validate((err) => {
                expect(err.errors.email).to.exists;
                expect(err.errors.passwordSalt).to.exists;
                done();
            });
        });


        it('should not validate an user if no password is supplied', (done) => {
            delete userInfo.password;
            const user = User(userInfo);

            user.validate((err) => {
                expect(err.errors.password).to.exists;
                expect(err.errors.passwordSalt).to.exists;
                done();
            });
        });


        it('should not validate an user if no password salt is generated', (done) => {
            const user = User(userInfo);

            user.validate((err) => {
                expect(err.errors.passwordSalt).to.exists;
                done();
            });
        });

    });


    describe('User registration', () => {

        it('Should register an user width email and password', sinon.test(function () {
            this.stub(User, 'register');
            const callback = sinon.spy();

            User.register(userInfo, callback);

            sinon.assert.calledWith(User.register, userInfo);
        }));


        it('Should register and callback an user with email and password', sinon.test(function () {
            const userResponse = _.assign(userInfo, {
                passwordSalt: 'SomeRandomPassowordSalt'
            });

            this.stub(User, 'register').yields(null, userResponse);

            User.register(userInfo, () => {});

            sinon.assert.calledWith(User.register, userResponse);
        }));

        // TODO: Find a way to test duplicated email
    });


    // describe('User Model Tests', () => {
    //     let savedUser = {};
    //
    //     it('should create an user', (done) => {
    //         const user = new User({
    //             name: 'Test User',
    //             email: 'test@gmail.com',
    //             mobileNumber: '4987658765'
    //         });
    //
    //         user.save((err, user) => {
    //             if (err) {
    //                 expect(err).to.be.null;
    //             }
    //
    //             expect(user.email).to.equal('test@gmail.com');
    //             expect(user).to.have.property('createdAt');
    //             expect(user).to.have.property('updatedAt');
    //             savedUser = user;
    //             done();
    //         });
    //     });
    //
    //     it('should not create a user with duplicated email', (done) => {
    //         const user = new User({
    //             name: 'Another Test User with Same Email',
    //             email: 'test@gmail.com',
    //             mobileNumber: '4887658765'
    //         });
    //
    //         user.save((err) => {
    //             expect(err).to.be.defined;
    //             expect(err.code).to.equal(11000);
    //             done();
    //         });
    //     });
    //
    //     it('should retrieve one saved user', (done) => {
    //         User.get(savedUser._id)
    //             .then((user) => {
    //                 expect(user.name).to.equal(savedUser.name);
    //                 expect(user.email).to.equal(savedUser.email);
    //                 expect(user.mobileNumber).to.equal(savedUser.mobileNumber);
    //                 done();
    //             }, (err) => {
    //                 expect(err).to.be.null;
    //                 done();
    //             });
    //     });
    //
    //     it('should not retrieve an user that not exists', (done) => {
    //         User.get('57676538ff7cdcaade01eccc')
    //             .then((user) => {
    //                 expect(user).to.be.null;
    //                 done();
    //             }, (err) => {
    //                 expect(err.name).to.equal('Error');
    //                 expect(err.status).to.equal(404);
    //                 done();
    //             });
    //     });
    //
    //     it('should retrieve all saved users', (done) => {
    //         User.list()
    //             .then((users) => {
    //                 expect(users).to.an.object;
    //                 expect(users.length).to.be.above(0);
    //                 done();
    //             }, (err) => {
    //                 expect(err).to.be.null;
    //             });
    //     });
    //
    //     it('should find user by email', (done) => {
    //         User.findOne({ email: 'test@gmail.com' }, (err, user) => {
    //             if (err) {
    //                 expect(err).to.be.null;
    //             }
    //
    //             expect(user.email).to.equal('test@gmail.com');
    //             done();
    //         });
    //     });
    //
    //     it('should delete a user', (done) => {
    //         User.remove({ email: 'test@gmail.com' }, (err) => {
    //             if (err) {
    //                 expect(err).to.be.null;
    //             }
    //
    //             done();
    //         });
    //     });
    // });

});
