const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    .populate('bloglists', {title: 1,
        author: 1,
        url: 1,
        likes: 1
    })
    
    return response.json(users)
})


usersRouter.get('/:id', async (request, response, next) => {
    curUser = await User.findById(request.params.id)

    try {
        if (curUser) {
            return response.json(curUser)
        } else {
            return response.status(404).end()
        }
    }catch(error) {
        next(error)
    }
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    if (password.length < 3) {
        return response.status(401).json({
            error: 'Password must be at least 3 characters long'
        });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return response.status(409).json({
            error: 'Username already exists.'
        });
    }

    const user = new User({
        username,
        name,
        passwordHash
    });


    const savedUser = await user.save();
    response.status(201).json(savedUser);

});

module.exports = usersRouter