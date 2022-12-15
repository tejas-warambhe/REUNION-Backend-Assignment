const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwtGenerator = require('../utils/jwt_generator');
const User = require('../models/user');

router.post("/register", async(req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });


        if (user !== null) {
            return res.status(401).send("User Already Exists");
        }


        // bycrpyting (hiding password)`
        const saltRound = 10;
        const generateSalt = await bcryptjs.genSalt(saltRound);

        const bcryptPassword = await bcryptjs.hash(password, generateSalt);


        const newUser = new User({
            email: email,
            password: bcryptPassword
        })
        await newUser.save();
        const token = jwtGenerator(newUser._id);

        return res.json({ token });

    } catch (err) {

        return res.status(500).send("server error");
    }
});

router.post('/authenticate', async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).send("Email or Password Incorrect");
        }

        const user = await User.findOne({ email: email })
            //check if user exists
        if (user === null) {
            return res.status(401).send("Email or Password Incorrect");
        }
        //check if password is same
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send("Email or Password Incorrect");
        }
        //grant the token

        const token = jwtGenerator(user._id);


        return res.status(201).json({ token });




    } catch (err) {
        return res.status(500).send(err.message);
    }
})












module.exports = router;