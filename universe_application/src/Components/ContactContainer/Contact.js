
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./Contact.css"

export default function Contact()
{
    const [information, setInformation] = useState({});
    useEffect(() => {
        const fetchAuthentication = async () => {
            const response = await axios.post('http://localhost:3001/auth/login/',
            {
                email: "sk@gmail.com",
                password: "helloworld"
            })
            const responseData = response.data;
            setInformation(responseData);
        }
        fetchAuthentication();
    },[]);

    useEffect(()=>{
        console.log(information);
    }, [information])

    return (
        <div className = "mainContactContainer">
            <div>
                <div>
                    <input type="search" placeholder="Search your Friends" className="searchbarforcontact"/>
                </div>
                <div>
                    <div className="userContainer">
                        <img src="" alt=""/>
                            <div>
                                <p className="userDetail"> {information.user._id} </p>
                                <p className="userDetail">Open your message</p>
                            </div>
                    </div>
                   

                </div>
            </div>
        </div>
    )
}