import mocha from 'mocha';
import { expect } from 'chai';
import googleBooks from '../lib/googleBooks.js';

describe('GoogleBooks without cache', function() {
  it('should return a JSON object of books with all fields', function() {
    const g0 = new googleBooks();
    return g0.search('Guinness World Records')
      .then(function(result) {
        expect(result[0]).to.have.property('title');
      })
  });

  it('should return a JSON object of books with a subset of fields', function() {
    const g1 = new googleBooks({ options: { returnFields: 'items(volumeInfo(title))' }});
    return g1.search('Guinness World Records')
      .then(function(result) {
        expect(result[0]).to.have.property('title');
        expect(result[0]).to.not.have.property('id');
      })
  });

  it('should return an empty object if there are no results', function() {
    const g2 = new googleBooks();
    return g2.search('JCEhrrpxF2E1s7aPW8zd2903tQ4AlCB9')
      .then(function(result) {
        expect(result).to.exist;
        expect(result).to.be.empty;
        expect(result.length).to.equal(0);
      })
  });

  it('should return a specified number of results', function() {
    const g3 = new googleBooks({ options: { limit: 15 }});
    return g3.search('Guinness World Records')
      .then(function(result) {
        expect(result).to.exist;
        expect(result.length).to.equal(15);
      })
  });

  it('should only accept a limit below 40', function() {
    expect(function() {
      const g4 = new googleBooks({ options: { limit: 50 }});
    }).to.throw(new Error('Limit must be between 1 and 40'));
  });

  it('should not accept an offset below 0', function() {
    expect(function() {
      const g5 = new googleBooks({ options: { offset: -1 }});
    }).to.throw(new Error('Offset cannot be below 0'));
  });

  it('should return an error if no query is specified', function() {
    const g6 = new googleBooks();
    expect(function() {
      g6.search(null);
    }).to.throw(new Error("Query is required"));
  });

});