import { Navigate } from "react-router-dom";
export function ProtectedRoute({activeUser, children, isLoading}) {
    
    if (isLoading) {
        return (
            <div className="p-6">Waking up server... this could take about 60 seconds</div>
        )
    }
    
    if (activeUser === null) {
        return <Navigate to={`/login`}/>
    }

    return children
}