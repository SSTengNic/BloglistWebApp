import { useState } from "react";

const Blog = ({ blog, updateLikes, user, handleBlogDelete }) => {
    const [showDetails, setShowDetails] = useState(false);

    const blogStlye = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    };

    const updateBlogLikes = (event) => {
        console.log(
            "FRONTEND/components/Blog/updateBlogLikes, Updating likes to blog.blog_id: ",
            blog.blog_id
        );

        event.preventDefault();
        updateLikes(blog.blog_id, {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1,
        });
    };

    const updateDeleteBlog = (event) => {
        console.log(
            "FRONTEND/components/Blog/updateDeleteBlog, user.id: ",
            user.id
        );
        console.log(
            "FRONTEND/components/Blog/updateDeleteBlog, blog.user_id: ",
            blog.user_id
        );

        event.preventDefault();
        console.log("Deleting blog...");
        handleBlogDelete(blog.blog_id);
    };

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (
        <div style={blogStlye}>
            <div>
                <strong>{blog.title}</strong> by <strong>{blog.author}</strong>
                <button onClick={toggleDetails}>
                    {showDetails ? "Hide" : "View"}
                </button>
            </div>
            {showDetails && (
                <div>
                    <p>
                        <strong>URL:</strong> {blog.url}
                    </p>
                    <p>
                        <strong>Likes: </strong>
                        {blog.likes}{" "}
                        <button onClick={updateBlogLikes}>Like</button>{" "}
                    </p>
                    <p>
                        <strong>Added By: </strong> {blog.user_username}{" "}
                    </p>
                    {blog.user_id === user.id ? (
                        <button onClick={updateDeleteBlog}>Delete </button>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default Blog;
