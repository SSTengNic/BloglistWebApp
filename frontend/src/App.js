
import { useState, useEffect, useRef, useCallback} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState(null)
  
  const [ errorMessage, setErrorMessage] = useState('') 

  const BlogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  console.log("rendered: ", blogs, "blogs")

  const handleLogin = async (loginObject) => {   
    try{
      console.log("loginObjects: ", loginObject.username, loginObject.password)

      const user = await loginService.login(loginObject)
      
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setNewMessage(`${user.username} has logged in.`)
    }
    catch (exception){
      setErrorMessage('Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);

    }
  
  }

  const handleLogOut = () => {
    
    console.log("Logging out...")
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)

  }

  const handleBlogUpload = useCallback(async (blogObject) => {
    BlogFormRef.current.toggleVisibility()

    try {
      const newBlog = await blogService.create(blogObject)
      console.log("New Blog created: ",newBlog)

      setBlogs([...blogs, newBlog])
      setNewMessage(`A new blog ${blogObject.title} by ${user.username} has been added.`)
    }
    catch(exception) {
      setErrorMessage('Failed to post')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
  }, [setErrorMessage])

  const handleBlogDelete = async (blogId) => {
    try {
      const response = await blogService.delBlog(blogId)
      console.log("Blog deleted successfully:", response); // Log success message

    }
    catch(exception) {
      setErrorMessage('Failed to Delete')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
  }

  const updateLikes = async (blogId, updatedBlogObject) => {
    console.log("In app.js, blogId is: ", blogId)
    try{
      const updatedBlog = await blogService.update(blogId,updatedBlogObject)
      setBlogs([...blogs, updatedBlog])
      window.location.reload();
    }
    catch(exception) {
      setErrorMessage('Failed to update Likes.')
      setTimeout(() => {
        setErrorMessage(null)
      }, (5000));
    }

  }

  useEffect(() => {
    blogService.getAll().then(blogs =>{
      console.log("Retrieving all the blogs.")
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs( blogs )
    })  
  }, [handleBlogUpload, handleBlogDelete, updateLikes])

  
    return (
    <div>
      <p>{errorMessage}</p>
      <h2>blogs</h2>
      {user === null
      ?
      <Togglable buttonLabel = "Login">
      <LoginForm
        handleLogin = {handleLogin}
        />
      </Togglable>
      :
      <div>
        <h2>Blogs </h2>
        <Notification message = {newMessage}/>
        <Togglable buttonLabel = "Create new Blog" ref = {BlogFormRef}>
        <BlogForm handleBlogUpload = {handleBlogUpload}/>
        </Togglable>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateLikes = {updateLikes} user = {user} handleBlogDelete = {handleBlogDelete}/>
        )}
        <button onClick = {()=>handleLogOut()}>Log out </button>


      </div>
    }
      
    </div>
  )
}

export default App