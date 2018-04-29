const saveToS3 = require('../saveToS3')
const fs = require('fs')
const AWS = require('aws-sdk')

const runTest = function() {
  var s3 = new AWS.S3()
  const fileData = fs.createReadStream(
    '/Users/rodrigoreis/Receipt-2623-1052.pdf'
  )

  saveToS3('arena-billing-invoices', 'Receipt-2623-1052.pdf', fileData, {
    invoiceId: '2623-1052'
  })
    .then(resp => {
      const url = s3.getSignedUrl('getObject', {
        Bucket: 'arena-billing-invoices',
        Key: 'Receipt-2623-1052.pdf',
        Expires: 60 * 60
      })
      console.log(url)
      console.log(resp)
    })
    .catch(err => {
      console.error(err)
    })
}

runTest()
