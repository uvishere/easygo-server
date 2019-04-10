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

//Logout from one device
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter( token => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send({message:"Successfully Logged out!"})
    } catch (e) {
        res.status(500).send(e)
    }
})

//Logout from all devices
router.post('/user/logoutall', auth,  async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
















