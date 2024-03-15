import {useState} from 'react'

const Blog = ({blog, updateLikes, user, handleBlogDelete}) => {

    const [showDetails,setShowDetails] = useState(false)


    const blogStlye = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const updateBlogLikes = (event) => {
        console.log("Updating likes to Blog ID: ", blog.id)

        event.preventDefault()
        updateLikes(blog.id, {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1
          })
    }

    const updateDeleteBlog = (event) => {

        
        console.log("user ID: ", user.id)
        console.log("blog's user ID: ", blog.user.id)
            
   
        event.preventDefault()
        console.log("Deleting blog...")
        handleBlogDelete(blog.id)



    }

    const toggleDetails =() => {
        setShowDetails(!showDetails)
    }

    return (
    <div style = {blogStlye}>
        <div>
            <strong>{blog.title}</strong> by <strong>{blog.author}</strong>
            <button onClick = {toggleDetails}>{showDetails? 'Hide': 'View'}</button>
        </div>
        {showDetails && (
            <div>
                <p><strong>URL:</strong> {blog.url}</p>
                <p><strong>Likes: </strong>{blog.likes} <button onClick = {updateBlogLikes}>Like</button> </p>
                <p><strong>Added By: </strong> {blog.user.username} </p>
                {blog.user.id === user.id
                ? <button onClick = {updateDeleteBlog}>Delete </button>
                : null}
            </div>
        )}
    </div>)
}

export default Blog