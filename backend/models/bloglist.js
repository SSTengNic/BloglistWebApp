const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
console.log('from models/bloglist, connecting to: ', url)

mongoose.connect(url)
    .then(result=> {
        console.log('connected to MongoDB, Bloglist')
    })
    .catch (error => {
            console.log('error connecting to MongoDB, Bloglist', error.message)
    })

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    })


blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Bloglist', blogSchema)