var mocha = require('mocha');
var should = require('should');
var books = require('../build/google-books-search.js');
var superagent = require('superagent');

describe('Searching', function() {

	it('should return a JSON object of books with all fields', function(done) {
		books.search(superagent, 'Guinness World Records', function(error, results) {
			should.not.exist(error);
			should.exist(results);
			console.log(results)
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

	it('the options argument should be optional', function(done) {
		books.search(superagent, 'Guinness World Records', function(error, results) {
			should.not.exist(error);
			should.exist(results);
			results[0].should.have.property('title');
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

	it('should only accept an limit below 40', function(done) {
		books.search(superagent, 'Guinness World Records', {
			limit: 50
		}, function(error, results) {
			should.exist(error);
			done();
		});
	});

	it('should return an error if no query is specified', function(done) {
		books.search(superagent, null, {}, function(error, results) {
			should.exist(error);
			should.not.exist(results);
			done();
		});
	});

});
