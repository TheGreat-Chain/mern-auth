const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

// VALIDATION OF USER INPUTS PREREQUISITES :
const joi = require('@hapi/joi');
const { append } = require('express/lib/response');
const { validateAsync } = require('@hapi/joi/lib/base');

// REGISTER - USER CREATION 

const registerSchema = joi.object({
    login: joi.string().min(1).required(),
    password: joi.string().min(8).required(),
});

router.post("/register", async (req, res) => {
    // Existing email ? :
    const loginExist = await User.findOne({ login: req.body.login });
     
    if(loginExist) {
        res.status(400).send("Login already exists \n"); 
        return;
    }
    
    // Password hashing :
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Actually adding new user :
    const user = new User({
        login: req.body.login,
        password: hashedPassword,
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

// LOGIN OF USER

const loginSchema = joi.object({
    login: joi.string().min(1).required(),
    password: joi.string().min(6).required(),
});

router.post("/login", async (req, res) => {

    // Existing email ? :
    const user = await User.findOne({ login: req.body.login });
    if (!user) {
        return res.status(400).send("Incorrect login");
    }

    // Passwords match ? :
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    

    if(!validPassword) {
        console.log(validPassword)
        return res.status(400).send("Incorrect Password");
    }

    try {
        // Validation of user inputs
        const { error } = await loginSchema.validateAsync(req.body);
        
        if(error) {
            return res.status(400).send(error.details[0].message);
        } else {
            res.send("Success ! Sending the JWT token ...");
            // sending the token
            const token = jwt.sign({ _id: user.login }, process.env.TOKEN_SECRET);
        }
    } catch(e) {
        res.status(500).send(e);
    }

});

module.exports = router;