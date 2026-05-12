import { useState } from "react"
import {motion, AnimatePresence} from 'framer-motion'
import {Link} from 'react-router-dom'

export function Signup ({createUser, createdUser, failedCreatedUser}) {
    
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
        <AnimatePresence>
        { failedCreatedUser || createdUser ? (
                <div className="fixed right-5 top-10 lg:right-10">
                    <motion.div 
                    initial={{opacity: 0, y: -25}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -25}}
                    transition={{duration: 0.2, ease: "easeInOut"}}
                    className={`bg-white px-6 py-4 rounded-lg border ${failedCreatedUser ? "border-rose-300" : "border-emerald-600"} flex gap-2 items-center`}>
                    
                    <i className={`${failedCreatedUser ? "fa-solid fa-triangle-exclamation text-rose-500" : "fa-solid fa-check text-emerald-700"} text-lg`}></i>
                    
                    <p className="text-center font-medium md:text-lg">{failedCreatedUser ? "Failed to create user, try again" : "Created user successfully"}</p>
                    </motion.div>
                </div>
        ): (
            ""
        )

        }
        </AnimatePresence>
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
                    className=" p-2 bg-cyan-700 hover:bg-cyan-800 text-neutral-100 font-medium rounded-xl cursor-pointer">Sign-up</button>
                    <div>
                    <p>Already have an account?</p>
                    <Link to={`/login`} className="underline text-cyan-700 hover:text-cyan-900">Login</Link>
                    </div>
                </div>
            </div>
        </>
    )
}