import { useState } from "react";

import './App.css'

import {useNavigate} from "react-router-dom";
function Login(){
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        "user_name":"",
        "email":"",
        "password":""
    });
    const [loginError,setLoginError]=useState("");
    const [registerError,setRegisterError]=useState("");
    const [loginLoading,setLoginLoading]=useState(false);

    
    function handleChange(event){
        const {name,value}=event.target;

        setFormData({
            ...formData,
            [name]:value
        });
        setLoginError("");
    }

    async function handleSubmit(event){
        event.preventDefault();
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
    async function navigateRegister(){
        await navigate("/register")
    }
return (
    
    <div className="login-page">
        <div className="login-card">
    <h1>Career Pilot</h1>
    <p className="login-subtitle">Login to your account</p>
    <form onSubmit={handleSubmit}>
    <div className="floating-field">
        <input id="login-user-name" className="username_input" type="text" name="user_name" value={formData.user_name} placeholder=" "
            onChange={handleChange}/>
        <label htmlFor="login-user-name">Username</label>
    </div>
        <p className="or-b/w-username and email">OR</p>
    <div className="floating-field">
        <input id="login-email" type="email" placeholder=" " name="email" value={formData.email}
            onChange={handleChange}/>
        <label htmlFor="login-email">Email</label>
    </div>
    <div className="floating-field">
        <input id="login-password" type="password" name="password" placeholder=" " value={formData.password}
            onChange={handleChange}/>
        <label htmlFor="login-password">Password</label>
    </div>

    <p className="register-line">New User? <a href="/register">register</a></p>
        {loginError&&(
            <p className="login-error">{loginError}</p>
        )}
    <button type="submit" disabled={loginLoading}>{loginLoading?"logging in...":"Login"}</button>
    </form>
    </div>
    </div>
)
}
export default Login;
