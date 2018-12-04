'use strict';

const aws = require('aws-sdk');
const shortid = require('shortid');
const s3 = new aws.S3({
  apiVersion: '2006-03-01',
});
require('dotenv').config();

const bucketName = process.env.SERVICE_BUCKET;
const urlPrefix = process.env.SERVICE_S3_URL_PREFIX;

console.log('uploads-sign is starting...');

module.exports = (event, callback) => {
  const body = JSON.parse(event.body);
  if (!body.hasOwnProperty('contentType')) {
    callback('no content type specified');
    return;
  } else if (!body.contentType.match(/(\.|\/)(gif|jpe?g|png)$/i)) {
    callback('invalid content type, gif, jpg, and png supported');
    return;
  }

  const extension = body.contentType.match(/(\.|\/)(gif|jpe?g|png)$/i)[2];
  // Generate a random id
  const fileBaseName = shortid.generate();
  const key = fileBaseName + '.' + extension;

  console.log('Event Type: ' + body.contentType);
  console.log('Bucket name: ' + bucketName);
  console.log('file key: ' + key);

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: '',
    ContentType: body.contentType,
    ACL: 'public-read',
    Expires: 600,
  };
  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      callback(err);
      return;
    }
    const response = {
      oneTimeUploadUrl: url,
      resultUrl: urlPrefix + key,
    };
    callback(null, response);
  });
};
