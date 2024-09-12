const router = require('express').Router()


const { home, getRegister, postRegister, getLogin, postLogin, logOut, readDoctors, readPatients, readIllnesses, getAddIllness, postAddIllness,  deleteIllness } = require('../controllers/controller')
const { pasien, dokter, isLoggedIn } = require('../middleWare/autenthificaation')



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
router.get('/illnesses/:id/edit')
router.post('/illnesses/:id/edit')
router.get('/illnesses/:id/delete', deleteIllness)


module.exports = router;