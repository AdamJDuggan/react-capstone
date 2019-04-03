const express = require('express')
const router = express.Router();
const passport = require('passport')
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const mongoose = require('mongoose')
const validateProfileInput = require('../../validation/profile')
const validateGoalsInput = require('../../validation/goals')

  

// Get current user profile
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
      const errors = {};
  
      Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            console.log(profile.user)
          if (!profile) {
            errors.noprofile = 'There is no profile for this user'
            return res.status(404).json(errors)
          }
          res.json(profile)
        })
        .catch(err => res.status(404).json(err))
    }
  )

// Get all profiles. Public
router.get('/all', (req, res) => {
  const errors = {};
  // Find in mongo gets all, same as shell 
  Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
    if(!profiles) {
      errors.noprofiles = 'There are no profiles';
      return res.status(404).json(errors)
    }
    res.json(profiles)
  })
  .catch(err => res.status(404).json({profiles: 'There are no profile for this user'}))

})

// Get req api/profile/handle/handle
// Backend API route hit by api. Not for user
// Public route//Do this for posts
router.get('/handle/:handle', (req, res) => {
    const errors = {}
    Profile.findOne({ handle: req.params.handle })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          res.status(404).json(errors)
        }
  
        res.json(profile);
      })
      .catch(err => res.status(404).json(err))
  });

// Get profile by user id. Public
router.get('/user/:user_id', (req, res) => {
    const errors = {}
    Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There is no profile for this user'
            res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json({profile: 'There is no profile for this user'}))
})

// Post create or edit/update/put user profile- private   
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body)
    // Check this validation and return errors 
    if(!isValid){return res.status(400).json(errors)}

    //  Get fields 
    const profileFields = {}
    profileFields.user = req.user.id 
    if(req.body.handle) profileFields.handle = req.body.handle
    if(req.body.skills) profileFields.skills = req.body.skills
    if(req.body.bio) profileFields.bio  = req.body.bio
    // Skills split into array
    if(typeof req.body.skills !== ''){
        profileFields.skills = req.body.skills.split(',')
    }
    if(req.body.bio) profileFields.handle = req.body.bio
    if(req.body.goals) profileFields.handle = req.body.goals
    // Social is object of fields 
    profileFields.social = {}   
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram


    Profile.findOne({user: req.user.id})
    .then(profile => {
        // Update
        if(profile){
            Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true}) 
            .then(profile => res.json(profile))
        }
        // Create profile first time login
        else{
            // Check if profile exists 
            Profile.findOne({handle: profileFields.handle})
            .then(profile => {
                if(profile){
                    errors.handle = 'That handle alreadt exists'
                    res.status(400).json(errors)
                }
                //Save profile
                new Profile(profileFields)
                .save()
                .then(profile => res.json(profile))
            })
        }
    })

})

// User goals- update my account by adding a goal. Private
router.post('/goals', passport.authenticate('jwt', {session: false}), (req, res) => {

  const {errors, isValid} = validateGoalsInput(req.body)
  // Check this validation and return errors 
  if(!isValid){return res.status(400).json(errors)}

  Profile.findOne({user: req.user.id})
  .then(profile => {
    
    const newGoal = {
      title: req.body.title, 
      description: req.body.description, 
      started: req.body.started, 
      deadline: req.body.deadline 
    }

    // Add to front of goals array and return profile with new experience 
    profile.goals.unshift(newGoal)
    profile.save()
    .then(profile => res.json(profile))
  })
})

// Delete goals with goal id. Private 
// router.delete('/goals/:goal_id', passport.authenticate('jwt', {session: false}),  (req, res) => {
//   Profile.findOne({user: req.user.id})
//   .then(profile => {
//     const removeIndex = profile.goals.map(item => item.id).indexOf(req.params.goal_id) 
//     // Splice out of array 
//     Profile.goals.splice(removeIndex, 1)
//     // Then save goals with the above removed
//     profile.save()
//     .then(profile => res.json(profile))
//   })
//   .catch(err => res.status(404).json(err))

// })

router.delete('/goals/:goal_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = 
          profile.goals
          .map(item => item.id)
          .indexOf(req.params.edu_id);
        // Splice out of array
        profile.goals.splice(removeIndex, 1);
        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);


// Delete user and profile. privae 
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({user: req.user.id})
  .then(() => {
    User.findOneAndRemove({_id: req.user.id})
    .then(() => res.json({success: true}))
  })
})




module.exports = router 