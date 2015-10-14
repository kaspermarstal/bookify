import querystring from 'querystring';
import extend from 'extend';
import defaultSuperagent from 'superagent';

// Base url for Google Books API
const baseUrl = "https://www.googleapis.com/books/v1/volumes?";

export default class GoogleBooks {
  constructor({ superagent: superagent = null, options: options = {} } = {}) {

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
      type: 'books',
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

    // User-provided superagent instance takes precedence
    this.superagent = (superagent) ? superagent : defaultSuperagent;

    // User-provided options takes precedence
    this.options = extend(defaultOptions, options || {});

    // Validate options
    if ( this.options.offset < 0) {
      throw Error('Offset cannot be below 0');
      return;
    }
    
    if ( this.options.limit < 1 || this.options.limit > 40 ) {
      throw Error('Limit must be between 1 and 40');
      return;
    }
  }

  async search(input) {
    return new Promise((resolve, reject) => {

      // Validate options
      if (!input) {
        callback(new Error("Query is required"));
        return;
      }

      // Google Books API key
      if (this.options.key) {
        query.key = this.options.key;
      }

      // Set any special keywords
      if (this.options.field) {
        input = fields[options.field] + input;
      }

      // Create the request uri
      let query = {
        q: input,
        startIndex: this.options.offset,
        maxResults: this.options.limit,
        printType: this.options.type,
        orderBy: this.options.order,
        langRestrict: this.options.lang,
      };
      
      // Restrict query to specified fields 
      if ( this.options.returnFields ) {
        query.fields = this.options.returnFields;
      }

      const uri = baseUrl + querystring.stringify(query);

      this.superagent
        .get(uri)
        .set('Accept-Encoding', 'gzip')
        .set('User-Agent', 'superagent-cache/1.0.3 (gzip)')
        .end(function(err, response) {
          if (err) {
            reject(err);
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
            resolve(results);
          } else {
            reject(err);
          }
        });
    });
  }
}