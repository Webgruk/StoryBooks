const express = require('express')
const router = express.Router()
const passport = require('passport')

//login / auth with google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

/// google auth callback

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard')
  },
)

//log out user
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})
module.exports = router
