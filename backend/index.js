const express = require('express')
const hbs = require('hbs')
const routes = require('./routes/routes')
const mcc = require('./routes/mcc')
const path = require('path')
const app = express()
const PORT = 3001

app.set('view engine', hbs)
app.use('/', routes)

app.use(express.static(path.join(__dirname, '/public')))

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`)
})
module.exports = app
