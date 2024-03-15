const jwt = require('jsonwebtoken')
const bloglistRouter = require('express').Router()
const Bloglist = require('../models/bloglist')
const User = require('../models/user')


bloglistRouter.get('/', async (request, response)=> {
    const bloglists = await Bloglist.find({})
    .populate('user', {username: 1, id: 1})

    return response.json(bloglists)
})

bloglistRouter.get('/:id', async (request, response, next)=> {
    try {
        const curBloglist = await Bloglist.findById(request.params.id)

        if (curBloglist) {
            return response.json(curBloglist)
        } else {
            return response.status(404).end()

        }
    }
    catch (error) {
        next(error)

    }

})


bloglistRouter.post('/', async (request, response, next) => {
    console.log("Token:", request.token);
    const decodedToken = jwt.verify(request.token, process.env.SECRET) 

    console.log("decoded Token: ", decodedToken)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token invalid!'})
    }

    const user = await User.findById(decodedToken.id)
    console.log("user id: ", user) 
    const body = request.body


    const bloglist = new Bloglist({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })

    console.log("bloglist is: ", bloglist)

    
    const savedBloglist = await bloglist.save()
    user.bloglists = user.bloglists.concat(savedBloglist._id)
    await user.save()

    return response.status(201).json(savedBloglist)
})

bloglistRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const bloglist = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
        }

    try {
        updatedBloglist = await Bloglist.findByIdAndUpdate(request.params.id, bloglist, {new: true})
        if (updatedBloglist) {
            console.log('Put successful.')
            return response.json(updatedBloglist)
        }
        else {
            return response.status(404).end()
        }
    }
    catch (error){
        next(error)
    }
})

bloglistRouter.delete('/:id', async (request, response, next)=> {


    const decodedToken = jwt.verify(request.token, process.env.SECRET) 

    console.log("decoded Token: ", decodedToken)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token invalid!'})
    }

    const user = await User.findById(decodedToken.id)
    console.log("backend delete id: ", request.params.id)

    const delBlog = await Bloglist.findById(request.params.id)
    console.log("delBlog: ",delBlog)
    console.log(user)

    if (delBlog.user.toString() === user.id.toString()) {

        await Bloglist.findByIdAndDelete(request.params.id)
        console.log('Delete Successful.')
        return response.status(204).end()

    } else {
        return response.status(403).json( {error: 'Unauthorized'})
    }



})

module.exports = bloglistRouter





