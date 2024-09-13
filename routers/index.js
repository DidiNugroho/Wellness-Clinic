const router = require('express').Router()

const { home, getRegister, postRegister, getLogin, postLogin, logOut, readDoctors, readPatients, readIllnesses, getAddIllness, postAddIllness,  deleteIllness, deletePatient, getEditIllness, postEditIllness } = require('../controllers/controller')
const { pasien, dokter, isLoggedIn } = require('../helper/helperMidelware')
const {signup, getBill} = require('../MVP/mailer')


// mailer
router.post('/user/signup', signup) 
router.post('/user/getBill', getBill) 


router.get('/', home)
router.get('/register', getRegister)
router.post('/register', postRegister)
router.get('/login', getLogin)
router.post('/login', postLogin)

router.use(isLoggedIn)

// router.use((req, res, next) => {
//     if (!req.session.userId ) {
//         return res.redirect('/login?error=please login first')
//     }
//     next()
//   }) 

router.get('/logout', logOut)
router.get('/doctors', pasien , readDoctors)
router.get('/patients', dokter, readPatients)
router.get('/illnesses', dokter , readIllnesses)
router.get('/illnesses/add', dokter , getAddIllness)
router.post('/illnesses/add', dokter , postAddIllness)
router.get('/illnesses/:id/edit', dokter, getEditIllness)
router.post('/illnesses/:id/edit', dokter, postEditIllness)
router.get('/illnesses/:id/delete', dokter, deleteIllness)
router.get('/patients/:id/delete', dokter, deletePatient)


module.exports = router;