'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment-method.payment-method');
