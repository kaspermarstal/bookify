# Bookify

A lightweight node wrapper for the Google Books API intended to be used with the `superagent-cache` module.

## Install

    npm install bookify

## Basic Usage

### .search(query, options, callback)

Search for books matching the specified query and automatically cache the result.

	import bookify from '../lib/bookify.js';
	import superagentCache from 'superagent-cache';

	const bookifyInMemoryCache = new bookify({ superagent: superagentCache() });
	bookifyInMemoryCache.search('Professional JavaScript for Web Developers')
		.then(function(result) {
			console.log(result);
		});
	});

This returns an array of JSON objects. For example;

	[
		{
			"id":"9KJJYFIss_wC",
			"title":"Professional Javascript For Web Developers 2Nd Ed",
			"authors":[
				"Nicholas C. Zakas"
			],
			"publisher":"John Wiley & Sons",
			"publishedDate":"2009-02-09",
			"pageCount":840,
			"printType":"BOOK",
			"thumbnail":"http://bks5.books.google.com.au/books?id=...",
			"language":"en",
			"link":"http://books.google.com.au/books?id=..."
		},

		...

	]

The result will be returned form the cache the next time the search is performed. `bookify` will fall gracefully fall back to a regular superagent instance (i.e. without cache) if the `superagent` argument is not supplied.

## Advanced Usage

The search method optionally accepts an options object. See below for an overview of the available options.

	import googlebooks from 'googlebooks';

	const options = {
		key: "YOUR API KEY",
		field: 'title',
		offset: 0,
		limit: 10,
		type: 'books',
		order: 'relevance',
		lang: 'en',
		returnFields: 'items(volumeInfo(title,authors,publishedDate))'
	};

	const bookifyNoCache = new bookify({ options: options });
	bookifyNoCache.search('Professional JavaScript for Web Developers') {
			console.log(results);
	});

## Options

`key` : Your Google API key (Optional)   
`field` : Search in a specified field (title, author, publisher, subject or isbn) (Optional)   
`offset` : The position in the collection at which to start the list of results (Default: 0)   
`limit` : The maximum number of results to return (Max 40) (Defult: 10)   
`type` : Restrict results to books or magazines (Default: all)   
`order` : Order results by relevance or newest (Default: relevance)   
`lang` : Restrict results to a specified language (two-letter ISO-639-1 code) (Default: en)
`returnFields`: Restrict response to the specified fields (Default: all)

For more info see the [Google Books API documentation](http://code.google.com/apis/books/docs/v1/using.html) and [superagent-cache documentation](https://github.com/jpodwys/superagent-cache).