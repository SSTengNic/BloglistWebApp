import {useState} from 'react'

const BlogForm = ({handleBlogUpload}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const addBlog = (event) => {
    console.log('Submitting blog with: ', title, author, url)
    event.preventDefault()
    handleBlogUpload({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return( 
    <form onSubmit = {addBlog}> 
    <div>
      title: 
      <input  
        type= ' text'
        value = {title}
        name = 'title'
        onChange = {(event) => setTitle(event.target.value)}
      /> 
    </div>
    <div>
      author: 
      
      <input  
        type= 'text'
        value = {author}
        name = 'author'
        onChange = {(event) => setAuthor(event.target.value)}
      /> 
    </div>
    <div>
      url: 
      <input  
        type= 'text'
        value = {url}
        name = 'url'
        onChange = {(event) => setUrl(event.target.value)}
      /> 
    </div>
    <button type = 'submit'>create</button>
  </form>
  )
}

export default BlogForm