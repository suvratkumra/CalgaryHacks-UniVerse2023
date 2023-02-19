import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./Login.css"
import logo from "../../logo.png"

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
        <div className="container">
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    <img src={logo} alt="Logo" className="logo-image" />
                    <label>
                        <input
                            placeholder='Email or Username'
                            type="text"
                            value={emailID}
                            onChange={handleEmailChange}
                            className="input_text"
                        />
                    </label>
                    <br />
                    <label>
                        <input
                            placeholder='Password'
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </label>
                    <br />
                    <div className="button-container">
                        <button type="submit" disabled={!isFormValid}> Log In</button>
                        <label className="button-label">
                        <br/> Don't have an account? Create one <span id = "here"> <u>here</u></span> 
                        </label>
                    </div>    
                </form>
              
            </div>
        </div>
    )
}
