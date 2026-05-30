'use strict';

module.exports = {
  routes: [
    { method: 'GET', path: '/categorie-produits', handler: 'categorie-produit.find', config: { auth: false } }
  ]
};
