const express = require('express')
const router = express.Router();
const User = require('../../models/User') 
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

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


module.exports = router 