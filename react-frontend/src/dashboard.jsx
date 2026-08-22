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

const [searchTerm,setSearchTerm]=useState("");

const [sortOrder,setSortOrder]=useState("newest");

const [statusFilter,setStatusFilter]=useState("all");

const [showCreateForm,setShowCreateForm]=useState(false);
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
        setShowCreateForm(false);

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

   const filteredApplications=applications.filter((application)=>{
   const matchesSearch=application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.role.toLowerCase().includes(searchTerm.toLowerCase());
    
        const matchesStatus=statusFilter==="all"|| application.status===statusFilter;
        return matchesSearch && matchesStatus;
   });
   const sortedApplications=[...filteredApplications].sort((a,b)=>{
    if (sortOrder === "newest"){
        return new Date(b.application_date)- new Date(a.application_date);
    }
    return new Date(a.application_date)-new Date(b.application_date);
   });

   const statuses=[
    ...new Set(applications.map((application)=>application.status))
   ];

   function handleLogout(){
    localStorage.removeItem("token");
    window.location.href="/";
   }

   function handleCreate(){
    setShowCreateForm(true);
   }
return(
    <>
    <header className="navbar">
    <h1>Job Tracker</h1>

    <button onClick={handleCreate}>Create New</button>
    <button onClick={handleLogout}>Logout</button>

    </header>

    {showCreateForm && (
        <div className="create-application-form">
            {
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
    <button type="button" onClick={()=>setShowCreateForm(false)}>Cancel</button>
    <button type="submit" disabled={createloading}>{createloading?"Adding...":"Add Application"}</button>
</form>
            }
        </div>
    )}
    {loading && <p>Loading Applications...</p>}
    {error && <p>{error}</p>}

    <div className="dashboard-controls">
        <input type="text" 
        placeholder="search by company or role.." 
        value={searchTerm} 
        onChange={(event)=>setSearchTerm(event.target.value)} />
    <select value={sortOrder} onChange={(event)=>setSortOrder(event.target.value)}>
        <option value="newest">Newest-Oldest</option>
        <option value="oldest">Oldest-Newest</option>
    </select>

    <select value={statusFilter} onChange={(event)=> setStatusFilter(event.target.value)}>
        <option value="all">All Statuses</option>
    
        {statuses.map((status)=>(
            <option key={status} value={status}>
                {status}
            </option>
        ))}
    </select>
    </div>

<div className="applications-container">
    {sortedApplications.map((application)=>
        <div className="application-card" key={application.id}>
            
            

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
            <div className="application-header">
                <div>
            <h2>{application.company}</h2>
            <h3>{application.role}</h3>
                </div>

            <span className="status">{application.status}</span>
            </div>
            
            <div className="application-details">
            <p><strong>{application.location}</strong></p>
            <p><strong>{application.job_type}</strong></p>
            <p><strong>{application.application_date}</strong></p>
            <p><strong>{application.job_url}</strong></p>
            <p><strong>{application.salary}</strong></p>
            <p><strong>{application.notes}</strong></p>
                </div>
            <div className="application-actions">
            <button onClick={()=>{handleEdit(application)}}>Edit</button>
            <button onClick={()=>{handleDelete(application.id)}} disabled={deleteLoading}>{deleteLoading?"Deleting...":"Delete"}</button>
            </div>
            
            </>
    )}
    </div>
)} 
</div>
 


    </>
);
}
export default Dashboard;