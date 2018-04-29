'use strict'
const wkhtmltopdf = require('wkhtmltopdf')
const StripeInvoiceHtml = require('./stripeInvoiceHtml')
const pathResolver = require('./pathResolver')
const saveToS3 = require('./saveToS3')
const fs = require('fs')

process.env['PATH'] =
  process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']

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
      company_name: 'Arena.im',
      company_address: '2443 Fillmore St #380-5512',
      company_zipcode: '94115',
      company_city: 'San Francisco',
      company_country: 'United States',
      company_logo: pathResolver('./arena-logo-purple.png'),
      color: '#2C75FF'
    },
    invoice,
    clientInfo
  )

  wkhtmltopdf.command = pathResolver('./wkhtmltopdf')
  let stream = wkhtmltopdf(html, { pageSize: 'letter' })
  console.log(`pdf generated`)
  saveToS3('arena-billing-invoices', `${invoice.id}.pdf`, stream, {
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
