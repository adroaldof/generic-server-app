/* globals describe, it */

import chai from 'chai';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import { expect } from 'chai';

import app from '../../index';


chai.config.includeStack = true;

describe('Core Tests', () => {

    describe('GET /api/core', () => {
        it('should retrieve index page', (done) => {
            request(app)
                .get('/api/core')
                .accept('application/json')
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.info).to.equal('Successfully got index');

                    done();
                });
        });


        it('should retrieve index page HTML mode', (done) => {
            request(app)
                .get('/api/core')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.text;

                    expect(answer).to.contains('Welcome');

                    done();
                });
        });
    });


    describe('GET /api/core/login', () => {
        it('should retrieve login page', (done) => {
            request(app)
                .get('/api/core/login')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.info).to.equal('Successfully got login');

                    done();
                });
        });


        it('should retrieve login page HTML mode', (done) => {
            request(app)
                .get('/api/core/login')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.text;

                    expect(answer).to.contains('Login');

                    done();
                });
        });
    });


    describe('GET /api/core/register', () => {
        it('should retrieve register page', (done) => {
            request(app)
                .get('/api/core/register')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.body.data;

                    expect(answer.info).to.equal('Successfully got register');

                    done();
                });
        });


        it('should retrieve register page HTML mode', (done) => {
            request(app)
                .get('/api/core/register')
                .expect(httpStatus.OK)
                .then((res) => {
                    const answer = res.text;

                    expect(answer).to.contains('Registration');

                    done();
                });
        });
    });


    // TODO: Implement all other routes tests


	describe('GET /api/core/json', () => {
		it('should return system ok object message', (done) => {
			request(app)
				.get('/api/core/json')
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.system).to.equal('OK');
                    expect(res.body.info).to.equal('System is up');
					done();
				});
		});
	});

    describe('POST /api/core/json', () => {
        it('should post system ok object message', (done) => {
            request(app)
                .post('/api/core/json')
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
