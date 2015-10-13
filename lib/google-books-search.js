import querystring from 'querystring';
import extend from 'extend';
import pkg from '../package.json';

// https://developers.google.com/books/docs/v1/using#st_params
const defaultOptions = {
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
	returnFields: null,
};

// Special Keywords
const fields = {
	title: 'intitle:',
	author: 'inauthor:',
	publisher: 'inpublisher:',
	subject: 'subject:',
	isbn: 'isbn:'
};

// Base url for Google Books API
const baseUrl = "https://www.googleapis.com/books/v1/volumes?";

	/**
	 * Search Google Books
	 * 
	 * @param str Query
	 * @param obj Options
	 * @param func Callback
	 */
export const search = function(superagent, query, options, callback) {

	// Make the options object optional
  if ( !callback || typeof callback != "function") {
  	// Callback is the third parameter
    callback = options;
    // No options
    options = undefined;
  }

	options = extend(defaultOptions, options || {});

	// Validate options
	if ( !query ) {
		callback(new Error("Query is required"));
		return;
	}

	if ( options.offset < 0) {
		callback(new Error("Offset cannot be below 0"));
		return;
	}
	
	if ( options.limit < 1 || options.limit > 40 ) {
		callback(new Error("Limit must be between 1 and 40"));
		return;
	}

	if ( options.returnFields != null && typeof(options.returnFields) != 'string') {
		callback(new Error("Option returnFields must be string"));
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
	};

	// Restrict query to specified fields
	if ( options.returnFields ) {
		query.fields = options.returnFields;
	}

	if (options.key) {
		query.key = options.key;
	}

	const uri = baseUrl + querystring.stringify(query);

	// Send Request with gzip enabled headers as specified by https://developers.google.com/books/docs/v1/performance
	superagent
		.get(uri)
		.set('Accept-Encoding', 'gzip')
		.set('User-Agent', 'node-superagent/' + pkg.version + ' (gzip)')
		.end(function(err, response) {
		if (err) {
			callback(err);
		}

		if ( response.statusCode && response.statusCode === 200 ) {

			// Array of JSON results to return
			let results = [];

			// Extract useful data
			if ( response.body.items ) {

				for(let i = 0; i < response.body.items.length; i++) {

					let book = response.body.items[i].volumeInfo;
					let push = {};

					// ID
					if (response.body.items[i].id) push.id = response.body.items[i].id;
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
			callback(new Error("Status Code: " + response.statusCode));
		}
	});
}
