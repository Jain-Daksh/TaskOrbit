import { Button } from 'antd';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className='navbar'>
      <div className='navbar-logo'>
        <h2>TaskManager</h2>
      </div>
      <div className='navbar-links'>
        <Link to='/login'>
          <Button type='link'>Login</Button>
        </Link>
        <Link to='/register'>
          <Button type='primary'>Register</Button>
        </Link>
      </div>
    </nav>
  );
}
