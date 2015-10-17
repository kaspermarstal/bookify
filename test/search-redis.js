import mocha from 'mocha';
import { expect } from 'chai';
import googlebooks from '../lib/googlebooks.js';
import superagentCache from 'superagent-cache';
import redisCache from 'cache-service-redis';

// Uncomment this to block http requests from all instances of superagentCache across the testing scripts
// new googlebooks({ superagent: superagentCache() });
