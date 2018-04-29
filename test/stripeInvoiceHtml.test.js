const path = require('path')
const StripeInvoiceHtml = require('../stripeInvoiceHtml')
const invoice = require('./invoice')
const fs = require('fs')

const html = StripeInvoiceHtml(
  {
    company_name: 'Trusk',
    company_address: '14 rue Charles V',
    company_zipcode: '75004',
    company_city: 'Paris',
    company_country: 'France',
    company_siret: '146-458-246',
    company_vat_number: '568-3587-345',
    company_logo: path.resolve('../arena-logo-purple.png'),
    color: '#2C75FF'
  },
  invoice,
  {
    client_company_name: 'My Company',
    client_company_address: '1 infinite Loop',
    client_company_zipcode: '95014',
    client_company_city: 'Cupertino, CA',
    client_company_country: 'USA',
    receipt_number: 'ER56T67'
  }
)

fs.writeFile('invoice.html', html, err => {
  if (err) return console.error(err)
  console.log('Invoice html saved to file.')
})
