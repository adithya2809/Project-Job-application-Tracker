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

return (
    
    <div className="login-page">
        <div className="login-card">
    <h1>Career Pilot</h1>
    <p className="login-subtitle">Login to your account</p>
    <form onSubmit={handleSubmit}>
    <input className="username_input" type="text" name="user_name" value={formData.user_name} placeholder="username"
        onChange={handleChange}/>
        <p className="or-b/w-username and email">OR</p>
    <input type="email" placeholder="email" name="email" value={formData.email}
        onChange={handleChange}/>
    <input type="password" name="password"  placeholder="password" value={formData.password}
        onChange={handleChange}/>

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
