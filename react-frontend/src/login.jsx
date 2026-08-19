import { useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import {useNavigate} from "react-router-dom";
function Login(){
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        "user_name":"",
        "email":"",
        "password":""
    });
    const [message,setMessage]=useState("");
    const [loginError,setLoginError]=useState("");
    const [loginLoading,setLoginLoading]=useState(false);

    
    function handleChange(event){
        const {name,value}=event.target;

        setFormData({
            ...formData,
            [name]:value
        })
    }

    async function handleSubmit(event){
        event.preventDefault();
        setMessage("");
        setLoginError("");
        setLoginLoading(true);

        try{
            const response=await fetch("http://localhost:8000/auth/login",{
                method:"POST",
                headers:{
                    "content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            }
        );
            const data=await response.json();
            if (response.ok){
                localStorage.setItem("token",data.access_token);
                setMessage("Login Successful")
                navigate("/dashboard")
            }
            else{
                setLoginError(data.detail)
            }
    }
        catch(error){
            setLoginError("Unable to connect to the server")
        }

        finally{
            setLoginLoading(false)
        }
    }

return (
    <>
    <h1>Login Page</h1>
    <form onSubmit={handleSubmit}>
    <input type="text" name="user_name" value={formData.user_name}
        onChange={handleChange}/>
    <input type="email" name="email" value={formData.email}
        onChange={handleChange}/>
    <input type="password" name="password" value={formData.password}
        onChange={handleChange}/>
    <button type="submit" disabled={loginLoading}>{loginLoading?"logging in...":"Login"}</button>
    </form>
    </>
)
}
export default Login;
