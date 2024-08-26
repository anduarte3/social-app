import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register'
import Feed from './components/Feed'
import './styles/global.css'
import './styles/tailwind.css';

function App() {
  return (
    
    

<div className="app">
      <Routes>
        <Route path='/' element={<div className='main-section'><Login/></div>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/feed' element={<Feed/>}></Route>
        <Route path="/*" element={<Navigate to="/"/>} />
      </Routes>
      
    </div>
  );
}

export default App;
