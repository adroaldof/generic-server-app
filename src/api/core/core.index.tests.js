/* globals describe, it */

import chai from 'chai';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import { expect } from 'chai';

import app from '../../index';


chai.config.includeStack = true;

describe('Core Tests', () => {
	describe('GET /api/core', () => {
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

    describe('POST /api/core', () => {
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
