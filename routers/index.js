const router = require('express').Router()
const { home, getRegister, postRegister } = require('../controllers/controller')

router.get('/', home)
router.get('/register', getRegister)
router.post('/register', postRegister)

module.exports = router;