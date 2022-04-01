const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

// VALIDATION OF USER INPUTS PREREQUISITES :
const joi = require('@hapi/joi');
const { append } = require('express/lib/response');

const registerSchema = joi.object({
    login: joi.string().min(1).required(),
    password: joi.string().min(8).required(),
});

// SIGN UP - USER CREATION 
router.post("/register", async (req, res) => {
    // Existing email ? :
    const loginExist = await User.findOne({ login: req.body.login });
     
    if(loginExist) {
        res.status(400).send("Email already exists \n"); 
        return;
    }
    
    // Password hashing :
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Actually adding new user :
    const user = new User({
        login: req.body.login,
        password: req.body.password,
    });

    try {
        const { error } = await registerSchema.validateAsync(req.body); //validation 

        if(error) {
            res.status(400).send(error.details[0].message);
            return;
        } else {
            // validated request => save user
            const saveUser = await user.save();
            res.status(200).send("New user " + JSON.stringify(user.login) + " is created !");
        }
    } catch(error) {
        res.status(500).send(error);
    }

});

module.exports = router;