import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const navStyle = {
  backgroundColor: '#333',
  padding: '10px 20px',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  margin: '0 10px',
  transition: 'color 0.2s, border-bottom 0.2s'
};

const activeLinkStyle = {
  borderBottom: '2px solid #fff'
};

const logoStyle = {
  ...linkStyle,
  fontWeight: 'bold',
  fontSize: '1.5rem'
};

const buttonStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  margin: '0 10px',
  fontSize: '1rem'
};

function Navbar() {
  const { auth, setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setAuthData(null);
    navigate('/login');
  };

  const renderLink = (to, label) => (
    <Link
      to={to}
      style={{
        ...linkStyle,
        ...(location.pathname === to ? activeLinkStyle : {})
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>FlashHire</Link>
      <div>
        {renderLink('/gigs', 'Gigs')}
        {auth.token ? (
          <>
            {renderLink('/dashboard', 'Dashboard')}
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <>
            {renderLink('/login', 'Login')}
            {renderLink('/register', 'Register')}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
