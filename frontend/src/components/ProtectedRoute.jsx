import { Navigate } from "react-router-dom";
export function ProtectedRoute({activeUser, children, isLoading}) {
    
    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }
    
    if (activeUser === null) {
        return <Navigate to={`/login`}/>
    }

    return children
}