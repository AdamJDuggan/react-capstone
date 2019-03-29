const express = require('express')
const router = express.Router();


//Test posts route: public 
router.get('/tests', (req, res) => {res.json({msg: 'posts works' })})



module.exports = router 