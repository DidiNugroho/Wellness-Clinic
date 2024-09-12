const { Op } = require('sequelize');
const { User } = require('../models')
const bcrypt = require('bcryptjs')
module.exports.home = async (req, res) => {  
    try {  
        res.render('Home')
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
        req.session.userId = user.id;
        if (user) {
            const isValidPass = bcrypt.compareSync(password, user.password)
            if (isValidPass) {
                return res.redirect('/')
            } else {
                return res.redirect(`/login?error=invalid email/password`)
            }
        } else {
            return res.redirect(`/login?error=user not found`)
        }
    } catch (error) {  
        res.send(error.message)
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