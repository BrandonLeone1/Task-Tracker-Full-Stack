import { useState } from "react"

export function Signup ({createUser}) {
    
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    async function handleClick () {
        await createUser(newUser);

        setNewUser({
            name: "",
            email: "",
            password: ""
        })
    } 
    
    return (
        <>
            <div className="flex justify-center h-screen items-center">
                <div className="flex flex-col gap-4 mt-6 bg-white p-6 rounded-lg">
                    <input type="text"
                    placeholder="Your name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({
                        ...prev,
                        name: e.target.value
                    }))}
                    className="border p-2 border-gray-300 rounded-xl"
                    />
                    <input 
                    type="email"
                    placeholder="Your email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({
                        ...prev, 
                        email: e.target.value
                    }))}
                    className="border p-2 border-gray-300 rounded-xl"
                    />
                    <input 
                    type="password"
                    placeholder="Your password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({
                        ...prev,
                        password: e.target.value
                    }))}
                    className="border p-2 border-gray-300 rounded-xl"
                    />

                    <button 
                    onClick={handleClick}
                    className=" p-2 bg-cyan-700 duration-300 text-neutral-100 font-medium rounded-xl cursor-pointer">Sign-up</button>
                </div>
            </div>
        </>
    )
}