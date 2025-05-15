import './App.css';
import './icons/icons.css';
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { DecodeJWT } from './internal/DecodeJWT';
import { useState, useEffect } from 'react';

import Auth from './components/Auth';
import Board from './routes/Board'
import Profile from './routes/Profile'
import AdminPanel from './routes/AdminPanel';
import Tickets from './routes/Tickets';
import UserTickets from './routes/UserTickets';

function App() {
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')

  function handleLogout() {
    localStorage.removeItem("air_port_token")
    window.location.reload()
  }

  let location = useLocation()
  const decodedJWT = DecodeJWT()
  const isAdmin = decodedJWT.role

  useEffect(() => {
     const updateDateTime = () => {
     const now = new Date()
      
     // Дата
     const year = now.getFullYear()
     const month = String(now.getMonth() + 1).padStart(2, '0')
     const day = String(now.getDate()).padStart(2, '0')
     setCurrentDate(`${year}-${month}-${day}`)
     
     // Время
     const hours = String(now.getHours()).padStart(2, '0')
     const minutes = String(now.getMinutes()).padStart(2, '0')
     const seconds = String(now.getSeconds()).padStart(2, '0')
     setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(intervalId)
  }, []);

  if (localStorage.getItem("air_port_token")) {
    return (
      <div className="App">
        <header>
          <div className='header_container space_between'>
            <Link to='/' className='logo'>airport</Link>

            <div className="profile_clock">
              <p>
                {currentDate}
              </p>
              <p>
                {currentTime}
              </p>
            </div>

            <div className='space_between'>
              <Link className='header_link'>
                <span className='icon notifications_icon' />
              </Link>
  
              <Link to='/profile' className='header_link'>
                <span className='icon profile_icon' />
              </Link>

              <span className='icon exit_icon' onClick={handleLogout} />
            </div>
          </div>
        </header>
  
        <ul className='user_nav_bar space_between'>
          <li className={`nav_bar_item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link to='/'>Главная</Link>
          </li>
          <li className={`nav_bar_item ${location.pathname === '/tickets/buy-ticket' ? 'active' : ''}`}>
            <Link to='/tickets/buy-ticket'>Купить билет</Link>
          </li>
          <li className='nav_bar_item'>Рейсы</li>
          <li className={`nav_bar_item ${location.pathname === '/tickets/my-tickets' ? 'active' : ''}`}>
            <Link to='/tickets/my-tickets'>Мои билеты</Link>
          </li>
          {decodedJWT.masterAdmin ? 
            <li className={`nav_bar_item ${location.pathname === '/admin-panel' ? 'active' : ''}`}>
              <Link to='/admin-panel'>Админ-панель</Link>
            </li>
            :
            null
          }
          {decodedJWT.masterAdmin ? 
            <li className={`nav_bar_item ${location.pathname === '/admin-panel/users' ? 'active' : ''}`}>
              <Link to='/admin-panel'>Сотрудники</Link>
            </li>
            :
            null
          }
        </ul>

        <div className="content">
          <Routes>
            <Route path='/' element={<Board isAdmin={isAdmin} />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/tickets/buy-ticket' element={<Tickets />} />
            <Route path='/tickets/my-tickets' element={<UserTickets />} />


            <Route path='admin-panel' element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    );
  }
  else {
    return (
      <Auth />
    );
  }
}

export default App;