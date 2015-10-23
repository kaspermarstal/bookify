import mocha from 'mocha';
import { expect } from 'chai';
import bookify from '../lib/bookify';
import superagent from 'superagent';
import superagentCache from 'superagent-cache';
import redisCache from 'cache-service-redis';

let bookifyRedisCache;

describe('Bookify with redis cache', function() {
  before(function() {
    delete superagent['cache'];
    bookifyRedisCache = new bookify({ 
      superagent: superagentCache(null, new redisCache({ redisUrl: 'http://user:pass@192.168.59.103:6379/'}))
    });
  }); 

  it('should return a JSON object of books with all fields', function() {
    return bookifyRedisCache.search('Guinness World Records')
      .then(function(result) {
        expect(result[0]).to.have.property('title');
      }, function(err) {
        expect(true).to.equal(false);
      })
  });

  it('should return a JSON object of books with all fields from cache', function() {

    // Querying GoogleBooks API usually takes 500-1000 ms
    this.timeout(100);

    return bookifyRedisCache.search('Guinness World Records')
      .then(function(result) {
        expect(result[0]).to.have.property('title');
      }, function(err) {
        expect(true).to.equal(false);
      });
  });
});
