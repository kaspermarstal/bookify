import mocha from 'mocha';
import { expect } from 'chai';
import googleBooks from '../lib/googleBooks.js';
import superagentCache from 'superagent-cache';

const googleBooksInMemoryCache = new googleBooks({ superagent: superagentCache() });

describe('GoogleBooks with in-memory cache', function() {
  it('should return a JSON object of books with all fields', function(done) {
    return googleBooksInMemoryCache.search('Guinness World Records')
      .then(function(result) {
        expect(result[0]).to.have.property('title');
        done();
      })
  });

  it('should return a JSON object of books with all fields from cache', function() {

    // Runtime is typically less than 1 ms but we give some 
    // wiggle room for resource constrained systems
    this.timeout(10);

    return googleBooksInMemoryCache.search('Guinness World Records')
      .then(function(result) {
        expect(result[0]).to.have.property('title');
      })
  });
});
