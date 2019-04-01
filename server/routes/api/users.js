const express = require('express')
const router = express.Router();
const User = require('../../models/User') 
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport =  require('passport')

// Test users routes 
router.get('/tests', (req, res) => {res.json({msg: 'users works' })})

// Register new user. PUBLIC route
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if(user){return res.status(400).json({email: 'Email already exists'})}
        else{

            const avatar = gravatar.url(req.body.email, {s: '200', rating: 'pg', default: 'mm'})

            newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar                 
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash)=> {
                    if(err) throw err;
                    newUser.password = hash
                    newUser.save()
                        .then(user =>  res.json(user) )
                        .catch(err => console.log(err))
                })
            })
        }
    })

})


// GET USERS/login returing jwt  
router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    // Find the user by email 
    User.findOne({email})
    .then(user => {
        // Check for existing user
        if(!user){return res.status(404).json({email: 'User not found'})}
        // check password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                // User matched
                if(isMatch){
                    // create jwt payload
                    const payload = {id: user.id, name: user.name, avatar: user.avatar}

                    // Sign token
                    jwt.sign(
                        payload, 
                        keys.secretOrKey, 
                        {expiresIn: 3600}, 
                        (err, token) => {res.json({success: true, token: 'Bearer ' + token})} 
                    )
                }
                else {return res.status(400).json({password: 'Password incorrect'})}
            })
    })    
})

// Current- return current user from sent jwt
router.get('/current', passport.authenticate
    ('jwt', {session: false}), 
    (req, res) =>  {res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email 
    })}
)   

module.exports = router 