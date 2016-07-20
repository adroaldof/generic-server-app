/* globals describe, it */

import _ from 'lodash';
import sinon from 'sinon';
import { expect } from 'chai';


import User from './model';


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


    // describe.only('Login User Tests', () => {
    //     it('should test login user', (done) => {
    //         let userObject = {
    //             email: 'john-doe@gmail.com',
    //             password: 'Passw0rd',
    //             passwordSalt: 'SomePasswordSalt'
    //         }
    //         let expecteUser = _.clone(userObject);
    //         _.unset(expecteUser, 'password');
    //         _.unset(expecteUser, 'passwordSalt');
    //
    //         const user = sinon.mock(User);
    //
    //         user.expects('authenticate')
    //             .once()
    //             .withArgs(userObject.email, userObject.password, expecteUser);
    //
    //         user.authenticate(userObject.email, userObject.password, (err, user) => {
    //             console.log('err', err);
    //             console.log('user', user);
    //             done();
    //         });
    //
    //         user.verify();
    //         user.restore();
    //     });
    // });

});
