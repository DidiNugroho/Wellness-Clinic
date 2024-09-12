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
                res.redirect('/login')
            } else {
                res.redirect('/register?error=register gagal')
            }
        }

    } catch (error) {  
        res.send(error.message)
    }  
};

module.exports.getLogin = async (req, res) => {  
    try {  
        res.render('Login')
    } catch (error) {  
        res.send(error.message)
    }  
};