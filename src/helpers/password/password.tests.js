/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import passwordHelper from './password';


describe(':: Passwords Tests ::', () => {
    let savedSalt = '';
    let savedHashedPassword = '';


    it('should throw and APIError if no parameters is supplied', (done) => {
        const err = passwordHelper.hashPassword();

        expect(err.name).to.equal('Error');
        expect(err.info).to.contains('passwordString, [passwordSaltString,] callbackFunction');

        done();
    });


    it('should throw password as string is necessary error', (done) => {
        passwordHelper.hashPassword(null, (err, hashedPassword, salt) => {
            expect(err).to.exists;
            expect(hashedPassword).to.not.exists;
            expect(salt).to.not.exists;
            expect(err.name).to.equal('Error');
            expect(err.info).to.equal('Password as string is necessary');

            done();
        });
    });


    it('should throw password as string is necessary as first parameter error', (done) => {
        passwordHelper.hashPassword((err, hashedPassword, salt) => {
            expect(err).to.exists;
            expect(hashedPassword).to.not.exists;
            expect(salt).to.not.exists;
            expect(err.name).to.equal('Error');
            expect(err.info).to.equal('Password as string is necessary as first parameter');

            done();
        });
    });


    it('should crete a hashed password', (done) => {
        passwordHelper.hashPassword('Passw0rd', (err, hashedPassword, salt) => {
            if (err) {
                expect(err).to.not.exists;
                done();
            }

            savedSalt = salt;
            savedHashedPassword = hashedPassword;

            expect(hashedPassword).to.exists;
            expect(salt).to.exists;

            done();
        });
    });


    it('should crete a hashed password when pass a salt parameter', (done) => {
        passwordHelper.hashPassword('Passw0rd', savedSalt, (err, hashedPassword) => {
            if (err) {
                expect(err).to.not.exists;
                done();
            }

            expect(hashedPassword).to.exists;
            expect(hashedPassword).to.equal(savedHashedPassword);

            done();
        });
    });


    it('should verify a password', (done) => {
        passwordHelper.verify('Passw0rd', savedHashedPassword, savedSalt, (err, isSamePassword) => {
            if (err) {
                expect(err).to.not.exists;
                done();
            }

            expect(isSamePassword).to.be.true;

            done();
        });
    });


    it('should not verify a password', (done) => {
        passwordHelper.verify('NotSamePassw0rd', savedHashedPassword, savedSalt,
            (err, isSamePassword) => {
                if (err) {
                    expect(err).to.not.exists;
                    done();
                }

                expect(isSamePassword).to.be.false;

                done();
            });
    });
});
