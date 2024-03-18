import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import signupService from "./services/signups";

import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import SignupForm from "./components/SignupForm";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [reloader, setReloader] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);

    const [notificationMessage, setNotificationMessage] = useState("");

    const BlogFormRef = useRef();

    //UseEffect to set the user when it mounts
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);
    //UseEffect to re-render the page with updated blogs
    useEffect(() => {
        blogService.getAll().then((blogs) => {
            console.log("FRONTEND/App.js/useEffect, Retrieving all the blogs.");
            blogs.sort((a, b) => b.likes - a.likes);
            setBlogs(blogs);
        });
    }, [reloader]);

    const handleLogin = async (loginObject) => {
        try {
            console.log(
                "FRONTEND/App.js/handlelogin, loginObject Info: ",
                loginObject.username,
                loginObject.password
            );

            const user = await loginService.login(loginObject);

            window.localStorage.setItem(
                "loggedBlogappUser",
                JSON.stringify(user)
            );

            blogService.setToken(user.token);
            setUser(user);
            setNewMessage(`${user.username} has logged in.`);
        } catch (exception) {
            setNotificationMessage("Wrong Credentials");
            setTimeout(() => {
                setNotificationMessage(null);
            }, 5000);
        }
    };

    const handleLogOut = () => {
        console.log("FRONTEND/App.js/handleLogout, Logging out.");
        window.localStorage.removeItem("loggedBlogappUser");
        setUser(null);
    };

    const handleBlogUpload = async (blogObject) => {
        BlogFormRef.current.toggleVisibility();

        try {
            const newBlog = await blogService.create(blogObject);
            console.log(
                "FRONTEND/App.js/handleBlogUpload, New Blog created: ",
                newBlog
            );

            setBlogs([...blogs, newBlog]);
            setNewMessage(
                `A new blog ${blogObject.title} by ${user.username} has been added.`
            );
            setReloader(!reloader);
        } catch (exception) {
            setNotificationMessage("Failed to post");
            setTimeout(() => {
                setNotificationMessage(null);
            }, 5000);
        }
    };

    const handleBlogDelete = async (blogId) => {
        try {
            const response = await blogService.delBlog(blogId);
            setReloader(!reloader);
        } catch (exception) {
            setNotificationMessage("Failed to Delete");
            setTimeout(() => {
                setNotificationMessage(null);
            }, 5000);
        }
    };

    const updateLikes = async (blogId, updatedBlogObject) => {
        console.log("FRONTEND/App.js/updateLikes, blogId: ", blogId);
        try {
            const updatedBlog = await blogService.update(
                blogId,
                updatedBlogObject
            );
            setBlogs([...blogs, updatedBlog]);
            setReloader(!reloader);
        } catch (exception) {
            setNotificationMessage("Failed to update Likes.");
            setTimeout(() => {
                setNotificationMessage(null);
            }, 5000);
        }
    };

    const handleSignup = async (signupObject) => {
        try {
            console.log("signUpObject is: ", signupObject);
            const postAccount = await signupService.signup(signupObject);
            console.log(
                "FRONTEND/App/handleSignup, Signup successful. Account details: ",
                postAccount
            );
            setNotificationMessage("Account Creation Successful.");
        } catch (exception) {
            setNotificationMessage("Failed to sign up account.");
            setTimeout(() => {
                setNotificationMessage(null);
            }, 5000);
        }
    };

    //gets all the blogs

    return (
        <div>
            <p>{notificationMessage}</p>
            <h2>blogs</h2>
            {user === null ? (
                <div>
                    <Togglable buttonLabel="Login">
                        <LoginForm handleLogin={handleLogin} />
                    </Togglable>

                    <Togglable buttonLabel="Signup">
                        <SignupForm handleSignup={handleSignup} />
                    </Togglable>
                </div>
            ) : (
                <div>
                    <h2>Blogs </h2>
                    <Notification message={newMessage} />
                    <Togglable buttonLabel="Create new Blog" ref={BlogFormRef}>
                        <BlogForm handleBlogUpload={handleBlogUpload} />
                    </Togglable>
                    {blogs.map((blog) => (
                        <Blog
                            key={blog.blog_id}
                            blog={blog}
                            updateLikes={updateLikes}
                            user={user}
                            handleBlogDelete={handleBlogDelete}
                        />
                    ))}
                    <button onClick={() => handleLogOut()}>Log out </button>
                </div>
            )}
        </div>
    );
};

export default App;
