import { useState } from 'react'
import { Signup } from './pages/Signup'
import {Routes, Route} from 'react-router-dom'
import { Login } from './pages/Login';
import { useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { PublicRoute } from './components/PublicRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ViewBoard } from './pages/ViewBoard';


function App() {
  
  const [activeUser, setActiveUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  async function createUser (newUser) {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(newUser)
    })
    const data = await response.json();
    console.log(data.success, data.message);
    if (data.success) {
      
      localStorage.setItem("token", data.token)
    }
  }

  async function loginUser (existingUser) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(existingUser)
    })
    const data = await response.json();
    

    if (data.success) {
      
      localStorage.setItem("token", data.token);
      await checkAuthAndGetUser();
    }
  }

  async function checkAuthAndGetUser () {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/auth/check`, {
      credentials: "include",
      headers: {"Authorization": `Bearer ${token}`}
    });
    const data = await response.json();
    

    if (data.success) {
      console.log(data.user)
      setActiveUser(data.user)
      setIsLoading(false);
    } else {
      setActiveUser(null);
      setIsLoading(false);
    }
    setIsLoading(false)
  }

  async function addBoard (newBoard) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/boards/add`, {
      method: "POST",
      headers: {"Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify(newBoard)
    })
    const data = await response.json();
    
    if (data.success) {
      setBoards(prev => [...prev, data.data])
    }
  }

async function getBoards () {
  setLoadingBoards(true);
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/boards/get`, {
    headers: {"Authorization": `Bearer ${token}`},
    credentials: "include"
  })
  const data = await response.json();
  
  if (data.success) {
    setBoards(data.data)
  }
 setLoadingBoards(false);
}

async function deleteMethod(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/boards/delete/${id}`, {
    method: "DELETE",
    headers: {"Content-Type": "application/json", 
      "Authorization": `Bearer ${token}`
    },
    credentials: "include"
  })
  const data = await response.json();
  console.log(data.success, data.message);
  if (data.success) {
    setBoards(prev => prev.filter(board => board._id !== id))
  }
}

  async function updateBoard(id, updatedBoard) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/boards/edit/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json", 
        "Authorization": `Bearer ${token}`},
      credentials: "include",
      body: JSON.stringify(updatedBoard)
    })
    const data = await response.json();
    console.log(data.success, data.message);
    if (data.success) {
      setBoards(prev => prev.map(board => {
        if (board._id === data.data._id) {
          return data.data
        } else {
          return board
        }
      }))
    }
  }

  async function addTask (newTask) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/tasks/add`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
      credentials: "include",
      body: JSON.stringify(newTask)
    })
    const data = await response.json();
    console.log(data.success, data.message);
    if (data.success) {
      setTasks(prev => [...prev, data.data])
    }

  }

  async function getTasks () {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/tasks/get`, {
      credentials: "include",
      headers: {"Authorization": `Bearer ${token}`}
    })
    const data = await response.json();
    console.log(data.success, data.message);
    if (data.success) {
      setTasks(data.data)
    }
  }

  async function deleteTaskMethod (id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/tasks/delete/${id}`, {
      method: "DELETE",
      headers: {"Authorization": `Bearer ${token}`},
      credentials: "include"
    })
    const data = await response.json();
    console.log(data.success, data.message);
    if (data.success) {
      setTasks(prev => prev.filter(task => task._id !== data.data._id))
    }
  }
  
  async function updateTasks (updatedTasks) {
    
    const previousTasks = [...tasks];
    try {
    setTasks(updatedTasks);
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/tasks/update-all`, {
      method: "PUT",
      headers:{"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
      credentials:"include",
      body: JSON.stringify(updatedTasks)
    })
    const data = await response.json();
    console.log(data.success, data.message)
    if (data.success) {
      console.log(data.data, "data")
    }
    if (!data.success) {
      setTasks(previousTasks)
      return
    }
    } catch (error) {
      setTasks(previousTasks)
    }
    
  }

console.log(loadingBoards)

useEffect(() => {
  checkAuthAndGetUser();
},[])
  return (
    <>
      <Routes>
        <Route path="/" element={
          <PublicRoute activeUser={activeUser} isLoading={isLoading}>
          <Signup createUser={createUser}/>
          </PublicRoute> } />

        <Route path='/login' element={
          <PublicRoute activeUser={activeUser} isLoading={isLoading}>
          <Login loginUser={loginUser}/>
          </PublicRoute>
          } />

        <Route path='/dashboard' element={
          <ProtectedRoute activeUser={activeUser} isLoading={isLoading}>
            <Dashboard loadingBoards={loadingBoards} activeUser={activeUser} getBoards={getBoards} getTasks={getTasks} addBoard={addBoard} boards={boards} deleteMethod={deleteMethod} updateBoard={updateBoard}/>
          </ProtectedRoute>
          
          } />
        <Route 
        path='/board/:id'
        element={
        <ProtectedRoute activeUser={activeUser} isLoading={isLoading}>
        <ViewBoard setTasks={setTasks} isLoading={isLoading} getBoards={getBoards} checkAuthAndGetUser={checkAuthAndGetUser} boards={boards} addTask={addTask} tasks={tasks} deleteTaskMethod={deleteTaskMethod} updateTasks={updateTasks}/>
        </ProtectedRoute>
      }
        />

        
      </Routes>
    </>
  )
}

export default App
