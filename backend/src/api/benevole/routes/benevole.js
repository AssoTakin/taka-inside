'use strict';

module.exports = {
  routes: [
    { method: 'GET', path: '/benevoles', handler: 'benevole.find', config: { auth: false } },
    { method: 'GET', path: '/benevoles/:id', handler: 'benevole.findOne', config: { auth: false } },
  ],
};
