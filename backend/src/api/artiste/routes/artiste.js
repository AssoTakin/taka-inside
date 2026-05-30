'use strict';

module.exports = {
  routes: [
    { method: 'GET', path: '/artistes', handler: 'artiste.find', config: { auth: false } },
    { method: 'GET', path: '/artistes/:slug', handler: 'artiste.findOne', config: { auth: false } }
  ]
};
