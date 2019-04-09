"use strict"

const express = require('express')
const User =  require('../models/user')
const auth = require ('../middleware/auth')
const consoleColor = require('chalk') 
const router = new express.Router()


//Register Users
router.post('/user', async (req, res) => {
    
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ message:"User Created Successfully", user, token })
    } catch (err) {
        res.status(400).send({error: "error occourd in registration", err})
    }
})


//Login User
router.post('/user/login', async (req, res) => {
    const {email, password} = req.body
    try {
        const verifiedUser = await User.findByCredentials(email, password)
        
        const token = await verifiedUser.generateAuthToken()
        console.log("token",consoleColor.green(token))

        res.status(201).send({ message:'user login successful', verifiedUser, token })
    } catch (e) {
        res.status(400).send({message:"some weird error occured while login", e})
    }
})



module.exports = router
















