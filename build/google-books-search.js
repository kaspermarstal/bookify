/**
 * google-books-search
 */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

// https://developers.google.com/books/docs/v1/using#st_params
var defaultOptions = {
	// Google API key
	key: null,
	// Search in a specified field 
	field: null,
	// The position in the collection at which to start the list of results (startIndex)
	offset: 0,
	// The maximum number of elements to return with this request (Max 40) (maxResults)
	limit: 10,
	// Restrict results to books or magazines (or both) (printType)
	type: 'all',
	// Order results by relevance or newest (orderBy)
	order: 'relevance',
	// Restrict results to a specified language (two-letter ISO-639-1 code) (langRestrict)
	lang: 'en',
	// Restrict response to the specified fields
	returnFields: 'items(volumeInfo(title,authors,publishedDate,imageLinks))'
};

// Special Keywords
var fields = {
	title: 'intitle:',
	author: 'inauthor:',
	publisher: 'inpublisher:',
	subject: 'subject:',
	isbn: 'isbn:'
};

// Base url for Google Books API
var baseUrl = "https://www.googleapis.com/books/v1/volumes?";

/**
 * Search Google Books
 * 
 * @param str Query
 * @param obj Options
 * @param func Callback
 */
var search = function search(query, options, callback) {

	// Make the options object optional
	if (!callback || typeof callback != "function") {
		// Callback is the second parameter
		callback = options;
		// No options
		options = undefined;
	}

	options = (0, _extend2['default'])(defaultOptions, options || {});

	// Validate options
	if (!query) {
		callback(new Error("Query is required"));
		return;
	}

	if (options.offset < 0) {
		callback(new Error("Offset cannot be below 0"));
		return;
	}

	if (options.limit < 1 || options.limit > 40) {
		callback(new Error("Limit must be between 1 and 40"));
		return;
	}

	// Set any special keywords
	if (options.field) {
		query = fields[options.field] + query;
	}

	// Create the request uri
	query = {
		q: query,
		startIndex: options.offset,
		maxResults: options.limit,
		printType: options.type,
		orderBy: options.order,
		langRestrict: options.lang,
		fields: options.returnFields
	};

	if (options.key) {
		query.key = options.key;
	}

	var uri = baseUrl + _querystring2['default'].stringify(query);

	// Send Request
	_superagent2['default'].get(uri).end(function (err, res) {
		if (err) {
			callback(err);
		}

		if (res.statusCode && res.statusCode === 200) {

			// Array of JSON results to return
			var results = [];

			// Extract useful data
			if (res.body.items) {

				for (var i = 0; i < res.body.items.length; i++) {

					var book = res.body.items[i].volumeInfo;
					var push = {};

					// ID
					if (res.body.items[i].id) push.id = res.body.items[i].id;
					// Title
					if (book.title) push.title = book.title;
					// Authors
					if (book.authors) push.authors = book.authors;
					// Publisher
					if (book.publisher) push.publisher = book.publisher;
					// Date Published
					if (book.publishedDate) push.publishedDate = book.publishedDate;
					// Page Count
					if (book.pageCount) push.pageCount = book.pageCount;
					// Publication Type
					if (book.printType) push.printType = book.printType;
					// Categories
					if (book.categories) push.categories = book.categories;
					// Thumbnail
					if (book.imageLinks && book.imageLinks.thumbnail) push.thumbnail = book.imageLinks.thumbnail;
					// Language
					if (book.language) push.language = book.language;
					// Link
					if (book.infoLink) push.link = book.infoLink;

					results.push(push);
				}
			}

			callback(null, results);
		} else {
			callback(new Error("Status Code: " + res.statusCode));
		}
	});
};

module.exports.search = search;