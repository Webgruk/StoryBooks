const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')
const { strategies } = require('passport')

// show add pate
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add')
})

//process POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Story.create(req.body)
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error)
    res.render('500')
  }
})

// show all stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('stories/index', { stories })
  } catch (error) {
    console.log(errors)
    res.render('500')
  }
})

//show single story
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean()

    if (!story) {
      return res.render('404')
    }
    res.render('stories/show', {
      story,
    })
  } catch (error) {
    console.log(error)
    res.render('404')
  }
})
// show edit page
router.get('/edit/:id', ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  }).lean()

  if (!story) {
    return res.render('404')
  }
  if (story.user != req.user.id) {
    res.redirect('/stories')
  } else {
    res.render('stories/edit', { story })
  }
})

// update stories
router.put('/:id', ensureAuth, async (req, res) => {
  let story = await Story.findById(req.params.id).lean()
  if (!story) {
    return res.render('404')
  }
  if (story.user != req.user.id) {
    res.redirect('/stories')
  } else {
    story = await Story.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
    res.redirect('/dashboard')
  }
})

// delete stories
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Story.findByIdAndDelete({ _id: req.params.id })
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error)
    return res.render('500')
  }
})

// get user storeis
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('stories/index', { stories })
  } catch (error) {
    console.log(error)
    res.render('404')
  }
})
module.exports = router
