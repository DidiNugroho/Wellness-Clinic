const { User } = require('../models')

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
    try {  
        const hashedPassword = 
        res.redirect('/')
    } catch (error) {  
        res.send(error.message)
    }  
};