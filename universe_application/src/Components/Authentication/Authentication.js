import React, { useState } from 'react';
import axios from 'axios';
import './Authentication.css'

export default function AuthPage() {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [major, setMajor] = useState('');
    const [file, setFile] = useState(null);
    const [formErrors, setFormErrors] = useState([]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleMajorChange = (event) => {
        setMajor(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFirstnameChange = (event) => {
        setFirstname(event.target.value);
    }
    const handleLastnameChange = (event) => {
        setLastname(event.target.value);
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = validateForm();
        if (errors.length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/auth/register', {
                firstName: firstname,
                lastName: lastname,
                email: email,
                password: password,
                friends: "none",
                location: "none",
                occupation: major

            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const validateForm = () => {
        const errors = [];

        if (username === '') {
            errors.push('Username is required');
        }

        if (password === '') {
            errors.push('Password is required');
        } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{12,}$/.test(password)) {
            errors.push('Password must be at least 12 characters long, and contain at least one uppercase letter, one digit, and one special character');
        }

        if (confirmPassword === '') {
            errors.push('Confirm password is required');
        } else if (password !== confirmPassword) {
            errors.push('Passwords do not match');
        }

        if (major === '') {
            errors.push('Major is required');
        }

        return errors;
    };

    return (
        <div className='overall'>
            <div className="universe__container">
                <span className='UniVerse'>UniVerse</span>
            </div>
            <span className='CreateAccount'>Create Account</span>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <span className='FirstName'>First Name*</span>:
                        <input type="text" value={firstname} onChange={handleFirstnameChange} className="input_firstname" />
                    </label>
                </div>
                <div>
                    <label>
                        <span className='LastName'>Last Name*</span>:
                        <input type="text" value={lastname} onChange={handleLastnameChange} className="input_lastname" />
                    </label>
                </div>
                <div>
                    <label>
                        <span className='Email'>Email*</span>:
                        <input type="text" value={email} onChange={handleEmailChange} className="input_email" />
                    </label>
                </div>
                <div>
                    <label>
                        <span className='username'>Username*</span>:
                        <input type="text" value={username} onChange={handleUsernameChange} className="input_username" />
                    </label>
                </div>
                <div>
                    <label>
                        <span className='Password'>Password*</span>:
                        <input type="password" value={password} onChange={handlePasswordChange} className="input_password" />
                    </label>
                </div>
                <div>
                    <label>
                        <span className='ConfirmPassword'>Confirm Password*</span>:
                        <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} className="input_cPassword" />
                    </label>
                </div>
                <div>
                    <label>
                        <span className='Major'>Major*</span>:
                        <input type="text" value={major} onChange={handleMajorChange} className="input_major" />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={username === '' || password === '' || confirmPassword === '' || major === ''} className='submit_button'><span className='Register'>Register</span></button>
                </div>
                <div>
                    
                    <ul className='password_criteria'>
                    Password must contain the following:
                        <li>12 letters or more</li>
                        <li>At least 1 Capital letter</li>
                        <li>At least 1 Number</li>
                        <li>At least 1 Special character</li>
                    </ul>
                    
                </div>
                {formErrors.length > 0 &&
                    <ul>
                        {formErrors.map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                }
            </form>
        </div>
    )
}