import chai from 'chai';
import { expect } from 'chai';

import passwordHelper from './password';


describe('Passwords Tests', () => {
    let savedSalt = '';
    let savedHashedPassword = '';

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
        const temper = savedSalt.concat('temper');

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
        const temper = savedSalt.concat('temper');

        passwordHelper.verify('NotSamePassw0rd', savedHashedPassword, savedSalt, (err, isSamePassword) => {
            if (err) {
                expect(err).to.not.exists;
                done();
            }

            expect(isSamePassword).to.be.false;
            done();
        });
    });
});
