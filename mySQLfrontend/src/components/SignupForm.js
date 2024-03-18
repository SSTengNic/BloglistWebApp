import { useState } from "react";

const SignupForm = ({ handleSignup }) => {
    const [accUsername, setAccUsername] = useState("");
    const [accName, setAccName] = useState("");
    const [accPassword, setAccPassword] = useState("");

    const signupPOST = (event) => {
        console.log(
            "FRONTEND/components/SignupForm, signing up with username: ",
            accUsername,
            "Password: ",
            accPassword
        );
        event.preventDefault();
        const accSignupObject = {
            username: accUsername,
            name: accName,
            password: accPassword,
        };
        handleSignup(accSignupObject);
        setAccUsername("");
        setAccName("");
        setAccPassword("");
    };

    return (
        <form onSubmit={signupPOST}>
            <div>
                New Username:
                <input
                    type="text"
                    value={accUsername}
                    name="username"
                    onChange={(event) => setAccUsername(event.target.value)}
                />
            </div>
            <div>
                Your Name:
                <input
                    type="text"
                    value={accName}
                    name="accName"
                    onChange={(event) => setAccName(event.target.value)}
                />
            </div>
            <div>
                Account Password:
                <input
                    type="text"
                    value={accPassword}
                    name="password"
                    onChange={(event) => setAccPassword(event.target.value)}
                />
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignupForm;
