const jwt = require('jsonwebtoken')
const User = require('../models/user')

const Auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET )

        /* Check for the user Token */
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        //Create the response payload
        req.token = token
        req.user = user
        next()

    } catch (e) {
        res.status(401).send({ Error: 'Please Authenticate.' })
    } 
}

module.exports = Auth