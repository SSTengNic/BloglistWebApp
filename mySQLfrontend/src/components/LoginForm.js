import { useState } from "react";

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    console.log(
        "FRONTEND/compoennts/LoginForm, logging in with username: ",
        username,
        "password: ",
        password
    );

    const loginPOST = (event) => {
        console.log("loginPOST");
        event.preventDefault();
        handleLogin({
            username: username,
            password: password,
        });
        setUsername("");
        setPassword("");
    };

    return (
        <form onSubmit={loginPOST}>
            <div>
                Username:
                <input
                    type="text"
                    value={username}
                    name="username"
                    onChange={(event) => setUsername(event.target.value)}
                />
            </div>
            <div>
                Password:
                <input
                    type="text"
                    value={password}
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
