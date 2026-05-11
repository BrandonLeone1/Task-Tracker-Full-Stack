import { useState } from "react"

export function Login ({loginUser}) {
    
    const [existingUser, setExistingUser] = useState({
        email: "",
        password: ""
    })

    async function handleClick () {
        await loginUser(existingUser);

        setExistingUser({
            email: "",
            password: ""
        })
    }
    
    return (
        <>
        
        <div className="flex items-center justify-center h-screen">

            <div className="flex flex-col gap-4 bg-white p-6 rounded-lg">
                <input 
                type="email"
                placeholder="Your email"
                value={existingUser.email}
                onChange={(e) => setExistingUser(prev => ({
                    ...prev,
                    email: e.target.value
                }))}
                 className="border p-2 border-gray-300 rounded-xl"
                />
                <input 
                type="password"
                placeholder="Your password"
                value={existingUser.password}
                onChange={(e) => setExistingUser(prev => ({
                    ...prev,
                    password: e.target.value
                }))}
                 className="border p-2 border-gray-300 rounded-xl"
                />
                
                <button
                onClick={handleClick}
                className="bg-cyan-700 text-neutral-100 p-2 rounded-xl"
                >Login</button>
            </div>

        </div>
        
        </>
    )
}