import express from 'express'
const app = express()

app.use('/', express.static('public'))
app.use(express.urlencoded({ extended: true }))

import https from 'https'
import { URLSearchParams } from 'url'
import info from './results.js'

app.route('/submit').get((req, res) => {
  const isLightBox = req.query.tokenType === 'lightbox'
  const { APIKEY, APIKEY2 } = process.env

  const paramsObject = Object.assign(req.query, {
    type: 'sale',
    security_key: isLightBox ? APIKEY : APIKEY2
  })
  const postData = new URLSearchParams(paramsObject).toString()

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
    response.on('data', buffer => {
      const params = new URLSearchParams(buffer.toString())
      const code = params.get('response_code')
      const clientQuery = new URLSearchParams({
        response: info.responseTypes[params.get('response')],
        result: info.resultCodes[code],
        reason: params.get('responsetext'),
        type: params.get('type'),
        transactionid: params.get('transactionid')
      })
      const redirectDomain = req.get('referer') // host for heroku referrer for melrose
      // `${req.protocol}://${redirectDomain}/result.html?` for local
      const resultPage = `${redirectDomain}result.html?`

      if (+code >= 100) res.redirect(`${resultPage}${clientQuery}`)
      else {
        console.log(`Response code: ${code} is not a valid code`)
        res.redirect(`${req.protocol}://${redirectDomain}`)
      }
    })
  })

  request.on('error', e => console.error(e))
  request.write(postData)
  request.end()
})

const { PORT } = process.env

app.listen(PORT, () => console.log('Server @PORT: ', PORT))
