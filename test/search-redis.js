import mocha from 'mocha';
import { expect } from 'chai';
import googlebooks from '../lib/googlebooks.js';
import superagentCache from 'superagent-cache';
import redisCache from 'cache-service-redis';

const googlebooksRedisCache = new googlebooks({ 
  superagent: superagentCache(null, redisCache({ redisUrl: 'http://user:pass@192.168.59.103:6379/'}))
});

describe('GoogleBooks with redis cache', function() {
  it('should return a JSON object of books with all fields', function() {
    return googlebooksRedisCache.search('Guinness World Records')
      .then(function(result) {
        expect(result[0]).to.have.property('title');
      }, function(err) {
        expect(true).to.equal(false);
      })
  });

  it('should return a JSON object of books with all fields from cache', function() {

    // Runtime is typically less than 1 ms but we give some 
    // wiggle room for resource constrained systems
    this.timeout(10);

    return googlebooksRedisCache.search('Guinness World Records')
      .then(function(result) {
        expect(result[0]).to.have.property('title');
      }, function(err) {
        expect(true).to.equal(false);
      });
  });
});
