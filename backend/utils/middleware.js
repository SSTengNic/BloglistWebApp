const User = require('../models/user')
const jwt = require('jsonwebtoken')


const unknownEndPoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (request, response) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(404).send({error: 'malformatted id'})
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }
    else {
        request.token = null
    }

    next()

}

const userExtractor = async (request, response, next) => {

    if (!request.token) {
        request.user = null
    }
    else {
        const decodedToken = jwt.verify(request.token, process.env.SECRET) 
        console.log("decoded Token: ", decodedToken)
        if (!decodedToken.id) {
            return response.status(401).json({error: 'token invalid!'})
        }  
    
        const user = await User.findById(decodedToken.id)

        request.user = user    

    }
   
    next()
}

module.exports = {unknownEndPoint, errorHandler, tokenExtractor, userExtractor}