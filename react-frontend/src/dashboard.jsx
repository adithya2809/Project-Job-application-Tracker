import { useState,useEffect } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function Dashboard(){
const [applications,setApplications]=useState([]);
const [loading,setLoading]=useState(true);
const [error,setError]=useState("");


useEffect(()=>{
    async function getApplications(){
        try{
            const token =localStorage.getItem("token");
            const response= await fetch("http://localhost:8000/applications",{
            method:"GET",
            headers:{Authorization:`Bearer ${token}`}
            }
            )
            if(!response.ok){
                throw new Error("Failed to fetch Applications");
            }
            const data=await response.json();
            setApplications(data);
            console.log(data);
        }
        catch (error){
            setError("Unable to load applications");
        }
        finally{
            setLoading(false);
        }
    }
    getApplications();
},[]);


    async function handleDelete(id){
        try{
            const token=localStorage.getItem("token");
            const response=await fetch("http://localhost:8000/applications/${id}",{
                method:"DELETE",
                headers:{Authorization: `Bearer ${token}` }
            }
            );
            if (!response.ok){
                throw new Error("Failed to Delete Application!")
            }
            setApplications(applications.filter((application)=>application.id!==id));
        }
    
        catch (error){
            setError("Failed to delete the Application");
        }

        
    }
    delete_application();


return(
    <>
    <h1>Dashboard</h1>

    {loading && <p>Loading Applications...</p>}
    {error && <p>{error}</p>}

    {applications.map((application)=>
        <div key={application.id}>
            <h2>{application.company}</h2>

            <p>{application.role}</p>
            <p>{application.location}</p>
            <p>{application.job_type}</p>
            <p>{application.status}</p>
            <p>{application.application_date}</p>
            <p>{application.job_url}</p>
            <p>{application.salary}</p>
            <p>{application.notes}</p>
            <button>Edit</button>
            <button onClick={()=>{handleDelete.id}}>Delete</button>
        </div>
    )}

    </>
);
}
export default Dashboard;