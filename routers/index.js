const router = require('express').Router()
const { User, Profile, Category, Illness, UserIllness } = require('../models')

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
// Route to display the edit form
router.get('/patients/:id/edit', async (req, res) => {  
    try {  
        // Fetch the patient with their profile and associated illnesses, including category information  
        const patient = await User.findOne({  
            where: { id: req.params.id },  
            include: [  
                {  
                    model: Profile,  
                    attributes: [  
                        'id', 'name', 'gender', 'UserId', 'specialization',  
                        'contact', 'createdAt', 'updatedAt'  
                    ]  
                },  
                {  
                    model: Illness,  
                    through: { attributes: [] }, // Exclude UserIllness attributes if not needed  
                    include: {  
                        model: Category,  
                        attributes: [  
                            'id', 'name', 'description',   
                            'createdAt', 'updatedAt'  
                        ]  
                    }  
                }  
            ]  
        });

        // Check if the patient was found  
        if (!patient) {  
            return res.status(404).send('Patient not found');  
        }  

        // Check if the profile exists  
        if (!patient.Profile) {  
            return res.status(404).send('Patient profile not found');  
        }  

        // Fetch all illnesses with their categories for the dropdown, if needed  
        const illnesses = await Illness.findAll({  
            include: [{  
                model: Category,  
                attributes: ['id', 'name'] // Adjust attributes as necessary  
            }]  
        });  

        // Render the editPatient view with patient and illnesses data  
        res.render('editPatient', { patient, illnesses });  
    } catch (err) {  
        console.error(err); // Log the error for debugging purposes  
        res.status(500).send(err.message);  
    }  
});





// Route to handle the form submission
router.post('/patients/:id/edit', async (req, res) => {
    try {
        const { id } = req.body;
        const patient = await User.findByPk(req.params.id);

        // Assign the new illness to the patient
        await patient.setIllnesses([id]);

        res.redirect('/patients');
    } catch (err) {
        res.status(500).send(err.message);
    }
});



module.exports = router;