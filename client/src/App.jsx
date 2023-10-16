import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './components/Login';
import NavBar from './components/NavBar';
import Register from './components/Register';
import Home from './components/Home';

import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<Home/>}/>
          {/* Login Page */}
          <Route path="/login" element={<Login/>}/>
          {/* Registration Page*/}
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
