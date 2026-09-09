import { useState } from "react";
import './App.css'
import { useNavigate } from "react-router-dom";

function Register(){
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        "user_name":"",
        "email":"",
        "password":""
    });
    const [error,setError]=useState("");
    const [registered,setRegistered]=useState(false);
    const [loading,setLoading]=useState(false);
    function handleChange(event){
        const {name,value}=event.target;

        setFormData({
            ...formData,
            [name]:value
        });
        setError("");
    }
    async function handleRegister(event){
        event.preventDefault();
        setError("");
        setRegistered(false);
        setLoading(true);

        try{
            const response=await fetch("http://localhost:8000/auth/register",{
                method:"POST",
                headers:{
                    "content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            });
            const data=await response.json();
            
            if (response.ok){
                setRegistered(true);
                setFormData({
                    user_name:"",
                    email:"",
                    password:""
                });
            } else {
                setError(data.detail || "Registration failed");
            }
        }
        catch{
            setError("Unable to connect to the server")
        }

        finally{
            setLoading(false)
        }
    }
    async function navgateLogin() {
        await navigate("/")
    }
return(
    <>
    <div className="login-page">
        <div className="login-card">
    <h1>Career Pilot</h1>
    <p className="login-subtitle">Register your account</p>
    <form onSubmit={handleRegister}>
    <input className="username_input" type="text" name="user_name" value={formData.user_name} placeholder="username"
        onChange={handleChange}/>
    <input type="email" placeholder="email" name="email" value={formData.email}
        onChange={handleChange}/>
    <input type="password" name="password"  placeholder="password" value={formData.password}
        onChange={handleChange}/>
        <button type="submit" disabled={loading}>{loading?"Registering...":"Register"}</button>
        {registered && <p>Registeration Succussful</p> && <button onClick={navgateLogin}>Login to your account</button>
        }
        {error &&
        <p>{error}</p>
        }
    </form>
    </div>
    </div>
    </>
)
}
export default Register;