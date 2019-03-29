const express = require('express')
const router = express.Router();

//Test profile routes route: public 
router.get('/tests', (req, res) => {res.json({msg: 'profile works' })})

module.exports = router 