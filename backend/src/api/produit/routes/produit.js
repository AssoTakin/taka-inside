'use strict';

module.exports = {
  routes: [
    { method: 'GET', path: '/produits', handler: 'produit.find', config: { auth: false } },
    { method: 'GET', path: '/produits/:slug', handler: 'produit.findOne', config: { auth: false } }
  ]
};
