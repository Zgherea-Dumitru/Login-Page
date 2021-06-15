const express = require('express');
const router = require('express').Router();

const { createUser, findEmail } = require("../models/User.Model");

// Password handler
const bcrypt = require('bcrypt')

// Sign up
router.post('/signup', async (req, res) => {
    let { firstname, lastname, password, email } = req.body;
    firstname = firstname.trim();
    lastname = lastname.trim();
    password = password.trim();
    email = email.trim();

    if (firstname == "" || lastname == "" || email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fiels!"
        })
    } else if (!/^[a-zA-Z ]*$/.test(firstname && lastname)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!"
        })
    } else {
        try {
            const existEmail = await findEmail(email);
            if (existEmail.length) {
                // An user already exists
                res.status(403).json({
                    status: "FAILED",
                    message: "Email already used"
                })
            } else {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                try {
                    const user = await createUser(firstname, lastname, hashedPassword, email);
                    if (user) {
                        res.json({
                            status: "SUCCES",
                            message: "User created"
                        })
                    }
                } catch (err) {
                    console.log(err);
                    res.status(403).json({
                        status: "FAILED",
                        message: "An error occurred while saving user account!"
                    })
                }
            }
        } catch (err) {
            console.log(error);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            })
        }
    }
})

// Sign in
router.post('/signin', async (req, res) => {
    let { password, email } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials suplied!"
        })
    } else {
        try {
            const existEmail = await findEmail(email);
            if (existEmail.length) {
                // An user exists
                const hashedPassword = existEmail[0].password;
                const goodPassword = await bcrypt.compare(password, hashedPassword);

                if (goodPassword) {
                    res.json({
                        status: "SUCCES",
                        message: "Sign In succesful!"
                    })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Wrong credentials!"
                    })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Wrong credentials!"
                })
            }
        } catch (err) {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error connecting an user!"
            })
        }
    }
})

module.exports = router;