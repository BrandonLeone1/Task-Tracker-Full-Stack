import { Navigate } from "react-router-dom";
export function PublicRoute({activeUser, children, isLoading}) {
    
    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }
    
    if (activeUser) {
        return <Navigate to={`/dashboard`}/>
    }

    return children
}