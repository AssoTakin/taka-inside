'use strict';

module.exports = {
  routes: [
    { method: 'GET', path: '/projets', handler: 'projet.find', config: { auth: false } },
    { method: 'GET', path: '/projets/:slug', handler: 'projet.findOne', config: { auth: false } }
  ]
};
