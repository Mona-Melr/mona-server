import express from 'express'
const app = express()

app.use('/', express.static('public'))
app.use(express.urlencoded({ extended: true }))

import https from 'https'
import { URLSearchParams } from 'url'
import info from './results.js'
app.route('/submit').get(({ query }, res) => {
  const postData = new URLSearchParams(Object.assign(query, {
    type: 'sale',
    security_key: process.env.APIKEY
  })).toString()

  const options = {
    hostname: 'monapaymentsolutions.transactiongateway.com',
    path: '/api/transact.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  const request = https.request(options, response => {
    // console.log(`STATUS: ${response.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    // response.on('data', chunk => console.log(`BODY: ${chunk}`))
    // response.on('end', () => console.log('Done'))

    response.on('data', buffer => {
      const params = new URLSearchParams(buffer.toString())
      const code = params.get('response_code')
      const clientParams = {
        response: info.responseTypes[params.get('response')],
        result: info.resultCodes[code],
        reason: params.get('responsetext'),
        type: params.get('type'),
        transactionid: params.get('transactionid')
      }
      const clientQuery = new URLSearchParams(clientParams)
      const success = 'https://shop.melrosemac.com/payments/receipt/?'
      const failure = 'https://shop.melrosemac.com/payments/cancelled/?'

      if (+code > 100) res.redirect(`${failure}${clientQuery}`)
      if (+code === 100) res.redirect(`${success}${clientQuery}`)
    })
  })
  request.on('error', e => console.error(e))

  request.write(postData)
  request.end()
})

const { PORT } = process.env
app.listen(PORT, () => console.log('Server @PORT: ', PORT))
