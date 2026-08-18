import { useState } from "react";

function Login(){
    const [formData,setFormData]=useState({
        "user_name":"",
        "email":"",
        "password":""
    }

    );
    function handleChange(event){
        const {name,value}=event.target;

        setFormData({
            ...formData,
            [name]:value
        })
    }
export default Login;
}

return (
    <>
    <h1>Login Page</h1>
    <input type="text" name="username" value={formData.user_name}
        onChange={handleChange}/>
    <input type="email" name="email" value={formData.email}
        onChange={handleChange}/>
    <input type="password" name="password" value={formData.password}
        onChange={handleChange}/>
    <button type="submit">Login</button>

    </>
)