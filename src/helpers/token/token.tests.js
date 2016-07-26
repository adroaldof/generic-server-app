/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import generateToken from './token';


describe('Token Tests', () => {
    it('should generate a token', (done) => {
        const randomBytes = 32;

        generateToken(randomBytes, (err, generatedToken) => {
            if (err) {
                expect(err).to.not.exists;
            }

            expect(generatedToken).to.exists;
            expect(generatedToken.length).to.equal(32);
            done();
        });
    });


    it('should generate a token with a function', (done) => {
        generateToken(null, (err, token) => {
            if (err) {
                expect(err).to.not.exists;
                done();
            }

            expect(token).to.exists;
            expect(token.length).to.equal(16);
            done();
        });
    });
});
