
const { Op } = require('sequelize');
const { User, Profile, Category, Illness, UserIllness } = require('../models')
const bcrypt = require('bcryptjs')

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
        const patients = await User.findAll({
            where: { role: 'Pasien' }, // Filter only 'Pasien' role
            include: [
              {
                model: Profile,
                attributes: ['name', 'gender'], // Include user's name and gender from Profile
              },
              {
                model: Illness,
                through: {
                  model: UserIllness,
                  attributes: [], // No additional attributes needed from the join table
                },
                include: {
                  model: Category,
                  attributes: ['name'], // Include the name from Category
                },
                attributes: ['name', 'symptoms'], // Fetch illness name and symptoms
              }
            ],
            attributes: ['id', 'createdAt'], // Optionally include User ID for internal use
          });

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

module.exports.getRegister = async (req, res) => {  
    try {  
        
        res.render('RegisterForm')
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
        res.send(error.message)
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



