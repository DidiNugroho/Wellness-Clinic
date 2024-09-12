const router = require('express').Router()

const { home, getLogin, postLogin, logOut, getRegister, postRegister, readDoctors, readPatients, readIllnesses, getAddIllness, postAddIllness, deleteIllness, deletePatient } = require('../controllers/controller')

router.get('/', home)
router.get('/register', getRegister)
router.post('/register', postRegister)
router.get('/login', getLogin)
router.post('/login', postLogin)
router.get('/logout', logOut)
router.get('/doctors', readDoctors)
router.get('/patients', readPatients)
router.get('/illnesses', readIllnesses)
router.get('/illnesses/add', getAddIllness)
router.post('/illnesses/add', postAddIllness)
router.get('/illnesses/:id/edit')
router.post('/illnesses/:id/edit')
router.get('/illnesses/:id/delete', deleteIllness)
router.get('/patients/:id/delete', deletePatient)


module.exports = router;