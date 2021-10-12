import express from 'express'
const app = express()

app.use('/', express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.route('/submit').get((req, res) => console.log(req.query) || res.send('TEST'))

const { PORT } = process.env
app.listen(PORT, () => console.log('Server @PORT: ', PORT))
