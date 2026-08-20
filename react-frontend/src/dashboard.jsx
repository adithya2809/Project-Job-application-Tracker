import { useState,useEffect } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function Dashboard(){
const [applications,setApplications]=useState([]);
const [loading,setLoading]=useState(true);
const [error,setError]=useState("");

const [editingId,setEditingId]=useState(null);

const [editFormData,setEditFormData]=useState({
    company: "",
    role: "",
    location: "",
    job_type: "",
    status: "",
    application_date: "",
    job_url: "",
    salary: "",
    notes: ""
});

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
            const response=await fetch(`http://localhost:8000/applications/${id}`,{
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
    
    function handleChange(event){
        const {name,value}=event.target;
        setEditFormData({
            ...editFormData,
            [name]:value
        }
        );
    }
    function handleEdit(application){
        setEditFormData({
        company: application.company,
        role: application.role,
        location: application.location,
        job_type: application.job_type,
        status: application.status,
        application_date: application.application_date,
        job_url: application.job_url,
        salary: application.salary,
        notes: application.notes
    });

    setEditingId(application.id);
}

async function handleSave(id){
    try{
    const token=localStorage.getItem("token");
    const response=await fetch(`http://localhost:8000/applications/${id}`,{
        method:"PATCH",
        headers:{ "content-type":"application/json",
            Authorization:`Bearer ${token}`},
        body:JSON.stringify(editFormData)
    });
    if(!response.ok){
        throw new Error("Failed to update application")
    }
    const updatedApplication=await response.json();
    setApplications(applications.map((application)=>application.id===id?updatedApplication:application
    ));
    setEditingId(null)
        }
    catch(error){
        setError("Unable to Update application")
    }
}
 
return(
    <>
    <h1>Dashboard</h1>

    {loading && <p>Loading Applications...</p>}
    {error && <p>{error}</p>}

    {applications.map((application)=>
        <div key={application.id}>
            
            

            {editingId===application.id ?(
            <>
            <input type="text" 
            name="company"
            value={editFormData.company} 
            onChange={handleChange}/>

            <input type="text" 
            name="role"
            value={editFormData.role} 
            onChange={handleChange}/>
            
            <input type="text" 
            name="location"
            value={editFormData.location} 
            onChange={handleChange}/>
            
            <input type="text" 
            name="job_type"
            value={editFormData.job_type} 
            onChange={handleChange}/>
            
            <input type="text" 
            name="status"
            value={editFormData.status} 
            onChange={handleChange}/>
            
            <input type="text" 
            name="application_date"
            value={editFormData.application_date} 
            onChange={handleChange}/>

            <input type="text" 
            name="job_url"
            value={editFormData.job_url} 
            onChange={handleChange}/>
            
            
            <input type="text" 
            name="salary"
            value={editFormData.salary} 
            onChange={handleChange}/>
            
            <input type="text" 
            name="notes"
            value={editFormData.notes} 
            onChange={handleChange}/>
            
            <button onClick={()=>handleSave(application.id)}>Save</button>
            
            <button onClick={()=>setEditingId(null)}>Cancel</button>
            </>
    ):(
        <>
        <h2>{application.company}</h2>

            <p>{application.role}</p>
            <p>{application.location}</p>
            <p>{application.job_type}</p>
            <p>{application.status}</p>
            <p>{application.application_date}</p>
            <p>{application.job_url}</p>
            <p>{application.salary}</p>
            <p>{application.notes}</p>

            <button onClick={()=>{handleEdit(application)}}>Edit</button>
            <button onClick={()=>{handleDelete(application.id)}}>Delete</button>
        </>
        
    )}
    </div>
)} 
    

    

    </>
);
}
export default Dashboard;