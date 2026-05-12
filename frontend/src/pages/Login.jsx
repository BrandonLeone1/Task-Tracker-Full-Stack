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
                <label htmlFor="email-input">Your email
                <input 
                type="email"
                id="email-input"
                placeholder="Email"
                value={existingUser.email}
                onChange={(e) => setExistingUser(prev => ({
                    ...prev,
                    email: e.target.value
                }))}
                 className="border p-2 w-full mt-2 border-gray-300 rounded-xl"
                />
                </label>
                <label htmlFor="password-input">Your password
                <input 
                type="password"
                id="password-input"
                placeholder="Password"
                value={existingUser.password}
                onChange={(e) => setExistingUser(prev => ({
                    ...prev,
                    password: e.target.value
                }))}
                 className="border p-2 w-full mt-2 border-gray-300 rounded-xl"
                />
                </label>
                <button
                onClick={handleClick}
                className="bg-cyan-700 hover:bg-cyan-800 cursor-pointer text-neutral-100 p-2 rounded-xl"
                >Login</button>
            </div>

        </div>
        
        </>
    )
}