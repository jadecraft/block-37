import Register from './register'
import {Routes, Route} from 'react-router-dom'
import Cookies from './Cookies'
import Login from './login'
import { useState } from 'react'

function App() {
  const[token, setToken] = useState(null);
 
  return (
    <>
    <Routes>
      <Route path='/' element={<Cookies/>}/>
      <Route path='/register' element={<Register setToken={setToken} />}/>
      <Route path='/login' element={<Login />}/>
    </Routes>
      
      </>
  )
}
      
  


export default App 