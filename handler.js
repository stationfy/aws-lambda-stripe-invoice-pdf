import { S3 } from 'aws-sdk'
;('use strict')
const wkhtmltopdf = require('wkhtmltopdf')
const StripeInvoiceHtml = require('./stripeInvoiceHtml')
const pathResolver = require('./pathResolver')
const saveToS3 = require('./saveToS3')
const fs = require('fs')

process.env['PATH'] =
  process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']

// Configuration block, replace with YOUR company information
const COMPANY_NAME = 'Arena.im'
const COMPANY_ADDRESS = '2443 Fillmore St #380-5512'
const COMPANY_ZIPCODE = '94115'
const COMPANY_CITY = 'San Francisco'
const COMPANY_COUNTRY = 'United States'
const COMPANY_LOGO_PATH = './arena-logo-purple.png'
const COLOR = '#2C75FF'
const S3_BUCKET = 'arena-billing-invoices'

/**
   * 
   * @param {*} event {invoice, clientInfo}
   *  invoice is the actual invoice object from stripe
   *  client info is an object with customer details, available properties:
   *  (client_company_name, client_company_address, client_company_zipcode, client_company_city, client_company_country, receipt_number)
   * @param {*} context 
   * @param {*} callback 
   */
module.exports.handler = (event, context, callback) => {
  const invoice = event.invoice
  const clientInfo = event.clientInfo
  console.log(`will generate pdf for invoice ${invoice.id}`)
  const html = StripeInvoiceHtml(
    {
      company_name: COMPANY_NAME,
      company_address: COMPANY_ADDRESS,
      company_zipcode: COMPANY_ZIPCODE,
      company_city: COMPANY_CITY,
      company_country: COMPANY_COUNTRY,
      company_logo: pathResolver(COMPANY_LOGO_PATH),
      color: COLOR
    },
    invoice,
    clientInfo
  )

  wkhtmltopdf.command = pathResolver('./wkhtmltopdf')
  let stream = wkhtmltopdf(html, { pageSize: 'letter' })
  console.log(`pdf generated`)
  saveToS3(S3_BUCKET, `${invoice.id}.pdf`, stream, {
    invoiceId: invoice.id
  })
    .then(resp => {
      console.log(`file saved to s3 key ${resp.location}`)
      return callback(null, { result: true })
    })
    .catch(err => {
      return callback(err)
    })
}
