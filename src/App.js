import './App.css';
import './icons/icons.css';
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { DecodeJWT } from './internal/DecodeJWT';

import Auth from './components/Auth';
import Board from './routes/Board'
import Profile from './routes/Profile'

function App() {
  function handleLogout() {
    localStorage.removeItem("air_port_token")
    window.location.reload()
  }

  let location = useLocation()
  const decodedJWT = DecodeJWT()
  const isAdmin = decodedJWT.role

  if (localStorage.getItem("air_port_token")) {
    return (
      <div className="App">
        <header>
          <div className='header_container space_between'>
            <Link to='/' className='logo'>airport</Link>
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
          <li className='nav_bar_item'>Купить билет</li>
          <li className='nav_bar_item'>Рейсы</li>
          <li className={`nav_bar_item ${location.pathname === '/tickets' ? 'active' : ''}`}>
            <Link to='/tickets'>Мои билеты</Link>
          </li>
          {isAdmin && (
            <li className='nav_bar_item'>Админ-панель</li>
          )}
        </ul>

        <div className="content">
          <Routes>
            <Route path='/' element={<Board isAdmin={isAdmin} />} />
            <Route path='/profile' element={<Profile />} />
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