const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')

//load config
dotenv.config({ path: './config/config.env' })

//passport config
require('./config/passport')(passport)

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

//session
const options = { mongoUrl: process.env.MONGO_URI }
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create(options),
  }),
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))

//port
const PORT = process.env.PORT || 5000

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

app.listen(
  PORT,
  console.log(`server running in${process.env.NODE_ENV}mode on port ${PORT}`),
)
