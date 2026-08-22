import {Navigate} from "react-router-dom";

function ProtectedRoute({children}){
    const token=localStorage.getItem("token");

    if(!token){
        return <Navigate to="/" replace/>
        console.log("ProtectedRoute token:",token);
    }

    return children
}
export default ProtectedRoute;