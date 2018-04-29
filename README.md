Generate PDF for Stripe invoice using AWS Lambda
================================================

This is a lambda function that takes an stripe invoice object (JSON) and customer related info to generate a PDF. The PDF will be saved to a S3 bucket where it could then be distributed (email, download, etc)

### Requirements

1. [Serverless framework](https://www.serverless.com)
2. NodeJS 8.10
3. An AWS account

### Configuration

1. Fill out your company information on handler.js configuration variables:

```
const COMPANY_NAME = 'Arena.im'
const COMPANY_ADDRESS = '2443 Fillmore St #380-5512'
const COMPANY_ZIPCODE = '94115'
const COMPANY_CITY = 'San Francisco'
const COMPANY_COUNTRY = 'United States'
const COMPANY_LOGO_PATH = './arena-logo-purple.png'
const COLOR = '#2C75FF'
const S3_BUCKET = 'arena-billing-invoices' //where the PDF generated will be saved
```

2. Change serverless.yml configuration

Change line 12 to your specific S3 bucket ARN

Change line 32 to include your logo file to the package

### Build and Deploy

1. npm install
2. serverless deploy (https://serverless.com/framework/docs/providers/aws/guide/deploying/)

### Execution

The lambda function receives an `event` parameter that is a JSON object with the following structure:

```
{
  invoice, //actual invoice object from Stripe, see https://stripe.com/docs/api#invoice_object
  clientInfo : { //customer being invoiced info
    client_company_name, 
    client_company_address, 
    client_company_zipcode, 
    client_company_city, 
    client_company_country, 
    receipt_number
  }
}
```

The function will then generate a PDF and save it to the S3 Bucket defined.

### Credits

- Thanks to https://github.com/jonathanasquier/stripe-pdf-invoice for the work generating the PDF using pug templates.
