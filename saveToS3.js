const AWS = require('aws-sdk')
const promisify = require('util').promisify

const putObjectToS3 = function(bucket, key, data, metadata) {
  return new Promise((resolve, reject) => {
    var s3 = new AWS.S3()
    var params = {
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: 'application/pdf',
      ContentDisposition: `attachment; filename="${key}"; filename*=UTF-8''${key}`
    }

    if (metadata) {
      params.Metadata = metadata
    }
    s3.upload(params, (err, resp) => {
      if (err) return reject(err)
      return resolve(resp)
    })
  })
}

module.exports = putObjectToS3
