import mocha from 'mocha';
import { expect } from 'chai';
import googleBooks from '../lib/googleBooks.js';
import superagentCache from 'superagent-cache';
import redisCache from 'cache-service-redis';

// Uncomment this to block http requests from all instances of superagentCache across the testing scripts
// new googleBooks({ superagent: superagentCache });