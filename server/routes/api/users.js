const express = require('express')
const router = express.Router();

// Test users/auth routes 
router.get('/tests', (req, res) => {res.json({msg: 'users works' })})

module.exports = router 