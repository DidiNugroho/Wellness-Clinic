const { User, Profile, Category, Illness, UserIlness } = require('../models')

module.exports.home = async (req, res) => {  
    try {  
        res.render('Home')
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.readDoctors = async (req, res) => {  
    try {  
        let doctors = await User.findAll({
            where: {
                role: 'Dokter'
            },
            include: {
                model: Profile,
                required:true
            }
        })
        res.render('Doctors', {doctors})
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.readPatients = async (req, res) => {  
    try {  
        let patients = await User.findAll({
            where: {
                role: 'Pasien'
            },
            include: {
                model: Profile,
                required:true
            }
        })
        res.render('Patients', {patients})
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.readIllnesses = async (req, res) => {  
    try {  
        let illnesses = await Illness.findAll({
            include: {
                model: Category
            }
        })
        res.render('Illness', {illnesses})
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.getAddIllness = async (req, res) => {  
    try {  
        const categories = await Category.findAll()
        res.render('AddIllnessForm', {categories})
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.postAddIllness = async (req, res) => { 
    let {name, imageURL, CategoryId, symptoms} = req.body 
    try {  
        await Illness.create({name, imageURL, CategoryId, symptoms})
        res.redirect('/illnesses')
    } catch (error) {  
        res.send(error.message)
    }  
};





module.exports.getRegister = async (req, res) => {  
    try {  
        
        res.render('RegisterForm')
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.postRegister = async (req, res) => {  
    try {  
        const hashedPassword = 
        res.redirect('/')
    } catch (error) {  
        res.send(error.message)
    }  
};