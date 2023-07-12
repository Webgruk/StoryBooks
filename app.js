const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const { create } = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
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

//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//method overide
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }),
)
//logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')) // log requests to the console
}

// handlebar helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs')

const hbs = create({
  extname: '.hbs',
  helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
  },
})
//handlebars
app.engine('.hbs', hbs.engine)
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

//global variable

app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

app.use(express.static(path.join(__dirname, 'public')))

//port
const PORT = process.env.PORT || 5000

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

app.listen(
  PORT,
  console.log(`server running in${process.env.NODE_ENV}mode on port ${PORT}`),
)
