'use strict';

const uploadsSign = require('./uploads-sign.js');

console.log('starting event...');

module.exports.sign = (event, context, callback) => {
  uploadsSign(event, (error, result) => {
    if (error) {
      context.fail(error);
      return;
    }
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify(result),
    };
    context.succeed(response);
  });
};
