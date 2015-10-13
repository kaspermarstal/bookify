var mocha = require('mocha');
var should = require('should');
var books = require('../build/google-books-search.js');
var superagent = require('superagent-cache')();

describe('Searching with in-memory cache (every second test should be faster)', function() {

  it('should return a JSON object of books with all fields', function(done) {
    books.search(superagent, 'Guinness World Records', function(error, results) {
      should.not.exist(error);
      should.exist(results);
      results[0].should.have.property('title');
      results[0].should.have.property('id');
      done();
    });
  });

  it('should return a JSON object of books with all fields faster', function(done) {
    books.search(superagent, 'Guinness World Records', function(error, results) {
      should.not.exist(error);
      should.exist(results);
      results[0].should.have.property('title');
      results[0].should.have.property('id');
      done();
    });
  });

  it('should return a JSON object of books with a subset of fields', function(done) {
    books.search(superagent, 'Guinness World Records', { returnFields: 'items(volumeInfo(title,authors,publishedDate))' }, function(error, results) {
      should.not.exist(error);
      should.exist(results);
      results[0].should.have.property('title');
      results[0].should.not.have.property('id');
      done();
    });
  });

  it('should return a JSON object of books with a subset of fields faster', function(done) {
    books.search(superagent, 'Guinness World Records', { returnFields: 'items(volumeInfo(title,authors,publishedDate))' }, function(error, results) {
      should.not.exist(error);
      should.exist(results);
      results[0].should.have.property('title');
      results[0].should.not.have.property('id');
      done();
    });
  });

  it('should return an empty object if there are no results', function(done) {
    books.search(superagent, 'JCEhrrpxF2E1s7aPW8zd2903tQ4AlCB9', {}, function(error, results) {
      should.not.exist(error);
      should.exist(results);
      results.length.should.equal(0);
      done();
    });
  });

  it('should return a specified number of results', function(done) {
    books.search(superagent, 'Guinness World Records', {
      limit: 15
    }, function(error, results) {
      should.not.exist(error);
      results.length.should.equal(15);
      done();
    });
  });

  it('should return a specified number of results faster', function(done) {
    books.search(superagent, 'Guinness World Records', {
      limit: 15
    }, function(error, results) {
      should.not.exist(error);
      results.length.should.equal(15);
      done();
    });
  });
});
