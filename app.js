const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const path = require('path')
dotenv.config({ path: './config/config.env' })

connectDB()
const app = express()

//logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')) // log requests to the console
}

//handlebars
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
const PORT = process.env.PORT || 5000

//port
app.listen(
  PORT,
  console.log(`server running in${process.env.NODE_ENV}mode on port ${PORT}`),
)
