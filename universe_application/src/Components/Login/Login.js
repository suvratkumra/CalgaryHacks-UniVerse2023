import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./Login.css"


export default function Login() {
    const [emailID, setEmailID] = useState('');
    const [password, setPassword] = useState('');
    const [information, setInformation] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post('http://localhost:3001/auth/login/',
            {
                email: emailID,
                password: password
            })
        const responseData = response.data;
        setInformation(responseData);

        console.log(information);
    };

    const handleEmailChange = (event) => {
        setEmailID(event.target.value);
        validateForm();
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        validateForm();
    };

    const validateForm = () => {
        setIsFormValid(emailID !== '' && password !== '');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input
                    type="text"
                    value={emailID}
                    onChange={handleEmailChange}
                />
            </label>
            <br />
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </label>
            <br />
            <button type="submit" disabled={!isFormValid}>Log in</button>

        </form>
    )
}