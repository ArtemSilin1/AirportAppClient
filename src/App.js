import './App.css';
import './icons/icons.css';

import {Link, Route, Routes} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header>
        <div className='header_container space_between'>
          <Link to='/' className='logo'>airport</Link>
          <div className='space_between'>
            <Link  className='header_link'>
              <span className='icon notifications_icon' />
            </Link>

            <Link to='/profile' className='header_link'>
              <span className='icon profile_icon' />
            </Link>
          </div>
        </div>
      </header>

      <ul className='user_nav_bar space_between'>
        <li className='nav_bar_item'>Главная</li>
        <li className='nav_bar_item'>Купить билет</li>
        <li className='nav_bar_item'>Рейсы</li>
      </ul>
    </div>
  );
}

export default App;
