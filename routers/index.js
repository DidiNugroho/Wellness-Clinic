const router = require('express').Router()
const { home, getRegister, postRegister, getLogin, postLogin, logOut } = require('../controllers/controller')

router.get('/', home)
router.get('/register', getRegister)
router.post('/register', postRegister)
router.get('/login', getLogin)
router.post('/login', postLogin)
router.get('/logout', logOut)

module.exports = router;