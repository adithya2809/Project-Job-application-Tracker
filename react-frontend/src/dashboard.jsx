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
const [saveLoading,setSaveLoading]=useState(false);
const [createloading,setCreateLoading]=useState(false);
const [deleteLoading,setDeleteLoading]=useState(false);

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

const [formData,setFormData]=useState({
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
        setDeleteLoading(true);
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
        finally{
            setDeleteLoading(false);
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
    setSaveLoading(true);
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
    finally{
        setSaveLoading(false);
    }
}
 
function handleCreateChange(event){
    const {name,value}=event.target;
    setFormData({
        ...formData,
        [name]:value
});
}

async function handleCreateSubmit(event) {
    event.preventDefault();
    setCreateLoading(true);
    try{
    const token = localStorage.getItem("token");
    const response=await fetch("http://localhost:8000/applications",{
        method:"POST",
        headers:{ "content-type":"application/json",
            Authorization:`Bearer ${token}`},
        body:JSON.stringify(formData)
    })

    const data =await response.json();

    if (response.ok){
        setApplications([...applications,data]);

        setFormData({
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
    }
    else{
        setError(data.detail)
    }
    }
    catch(error){
        setError("Unable to create Application")
    }
    finally{
        setCreateLoading(false)
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
            
            <input type="date" 
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
            
            <button onClick={()=>handleSave(application.id)} disabled={saveLoading}>{saveLoading?"saving...":"Save"}</button>
            
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
            <button onClick={()=>{handleDelete(application.id)}} disabled={deleteLoading}>{deleteLoading?"Deleting":"Delete"}</button>
        </>
        
    )}
    </div>
)} 

 
<form onSubmit={handleCreateSubmit}>
    <input type="text" 
    name="company" 
    placeholder="company" 
    value={formData.company} 
    onChange={handleCreateChange}/>

     <input
        type="text"
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleCreateChange}
    />

    <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleCreateChange}
    />

    <input
    type="text"
    name="job_type"
    placeholder="Job Type"
    value={formData.job_type}
    onChange={handleCreateChange}
/>

<input
    type="text"
    name="status"
    placeholder="Status"
    value={formData.status}
    onChange={handleCreateChange}
/>

<input
    type="date"
    name="application_date"
    value={formData.application_date}
    onChange={handleCreateChange}
/>

<input
    type="text"
    name="job_url"
    placeholder="Job URL"
    value={formData.job_url}
    onChange={handleCreateChange}
/>

<input
    type="number"
    name="salary"
    placeholder="Salary"
    value={formData.salary}
    onChange={handleCreateChange}
/>

<textarea
    name="notes"
    placeholder="Notes"
    value={formData.notes}
    onChange={handleCreateChange}
/>

    <button type="submit" disabled={createloading}>{createloading?"Adding...":"Add Application"}</button>
</form>
    

    </>
);
}
export default Dashboard;