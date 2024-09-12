
const { Op } = require('sequelize');
const { User, Profile, Category, Illness, UserIllness } = require('../models')
const bcrypt = require('bcryptjs');
const illness = require('../models/illness');

module.exports.home = async (req, res) => {  
    try {  
        res.render('Home')
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.readDoctors = async (req, res) => { 
    let { search } = req.query; 
    try { 
        const searchCondition = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } }, 
                { '$Profile.specialization$': { [Op.iLike]: `%${search}%` } } 
            ]
        } : {};

        let doctors = await User.findAll({
            where: {
                role: 'Dokter',
                ...searchCondition // Apply search condition
            },
            include: {
                model: Profile,
                required: true
            }
        });
        res.render('Doctors', { doctors });
    } catch (error) {  
        res.send(error.message);
    }  
};


module.exports.readPatients = async (req, res) => {  
    let { search } = req.query
    try { 
        const searchCondition = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } }, 
                { '$Illnesses.name$': { [Op.iLike]: `%${search}%` } } 
            ]
        } : {};

        const patients = await User.findAll({
            where: { 
                role: 'Pasien', 
                ...searchCondition
            },
            include: [
              {
                model: Profile,
                attributes: ['name', 'gender']
              },
              {
                model: Illness,
                through: {
                  model: UserIllness,
                  attributes: []
                },
                include: {
                  model: Category,
                  attributes: ['name']
                },
                attributes: ['name', 'symptoms']
              }
            ],
            attributes: ['id', 'createdAt']
          });

        res.render('Patients', {patients})
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.readIllnesses = async (req, res) => {
    let { search } = req.query  
    try {  
        let illnesses = await Illness.searchIllness(search)
        res.render('Illness', {illnesses})
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.getAddIllness = async (req, res) => {  
    const { errors } = req.query
    try {  
        const categories = await Category.findAll()
        res.render('AddIllnessForm', {categories, errors})
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
        if (error.name == 'SequelizeValidationError') {
            const errors = error.errors.map((e) => e.message).join(',');
            return res.redirect('/illnesses/add?errors=' + encodeURIComponent(errors));
        }
    }  
};

module.exports.getEditIllness = async (req, res) => {  
    let { errors } = req.query
    let { id } = req.params;
    try {  
        const illness = await Illness.findByPk(id, {
            include: {
                model: Category,
                attributes: ['name'] // Fetch only the name of the category
            }
        });
        const categories = await Category.findAll();
        res.render('EditIllnessForm', {illness, categories, errors})
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.postEditIllness = async (req, res) => { 
    let { id } = req.params
    let {name, imageURL, CategoryId, symptoms} = req.body 
    try {  
        const illness = await Illness.findByPk(id, {
            include: {
                model: Category,
                attributes: ['name'] // Fetch only the name of the category
            }
        });
        await illness.update({name, imageURL, CategoryId, symptoms})
        res.redirect('/illnesses')
    } catch (error) {  
        if (error.name == 'SequelizeValidationError') {
            const errors = error.errors.map((e) => e.message).join(',');
            return res.redirect(`/illnesses/${id}/edit?errors=` + encodeURIComponent(errors));
        }
    }  
};

module.exports.deleteIllness = async (req, res) => { 
    let { id } = req.params;
    try {
       const illnesses = await Illness.findByPk(id)
       await illnesses.destroy()
       res.redirect('/illnesses')
    } catch (error) {
       res.send(error.message) 
    }
};

module.exports.deletePatient = async (req, res) => { 
    let { id } = req.params;
    try {
       const users = await User.findByPk(id)
       await users.destroy()
       res.redirect('/patients')
    } catch (error) {
       res.send(error.message) 
    }
};

module.exports.getRegister = async (req, res) => {  
    let { errors } = req.query
    try {  
        res.render('RegisterForm', {errors})
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.postRegister = async (req, res) => {  
    let { name, email, password, role } = req.body
    try {  
        let check = await User.findOne({
            where: {
                email: {
                    [Op.iLike]: `${email}`
                }
            }
        });
        if (check) {
            res.redirect('/register?error=email sudah terpakai')
        } else {
            let newUser = await User.create({
                name, email, password, role
            });
            if (newUser) {
                req.session.userId = newUser.id;
                req.session.role = newUser.role;
                res.redirect('/Login')
            } else {
                res.redirect('/register?error=register gagal')
            }
        }
    } catch (error) {  
        if (error.name == 'SequelizeValidationError') {
            const errors = error.errors.map((e) => e.message).join(',');
            return res.redirect('/register?errors=' + encodeURIComponent(errors));
        }
    }  
};

module.exports.getLogin = async (req, res) => { 
     let { error } = req.query
    try {  
        res.render('Login', { error })
    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.postLogin = async (req, res) => {
    let { email, password } = req.body
    try {
        let user = await User.findOne({
            where: {
                email
            }
        })

        if (user) {
            const isValidPass = bcrypt.compareSync(password, user.password)
            if (isValidPass) {
                req.session.userId = user.id;
                req.session.userRole = user.role;

                // Menggunakan returnTo jika ada, jika tidak kembali ke homepage
                const returnTo = req.session.returnTo || '/';
                delete req.session.returnTo; // Hapus returnTo dari session setelah digunakan

                return res.redirect(returnTo);
            } else {
                return res.redirect(`/login?error=Invalid email/password`);
            }
        } else {
            return res.redirect(`/login?error=User not found`);
        }
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/login?error=An error occurred during login');
    }
};

module.exports.logOut = async (req, res) => { 
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            req.send(err)
        } else {
            res.redirect('/login')
        }
    })
};