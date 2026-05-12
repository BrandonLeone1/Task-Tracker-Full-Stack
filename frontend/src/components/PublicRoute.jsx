import { Navigate } from "react-router-dom";
export function PublicRoute({activeUser, children, isLoading}) {
    
    if (isLoading) {
        return (
            <div className="p-6">Waking up server... this could take about 60 seconds</div>
        )
    }
    
    if (activeUser) {
        return <Navigate to={`/dashboard`}/>
    }

    return children
}