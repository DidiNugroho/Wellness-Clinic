const router = require('express').Router()
const { home, getRegister } = require('../controllers/controller')

router.get('/', home)
router.get('/register', getRegister)

module.exports = router;