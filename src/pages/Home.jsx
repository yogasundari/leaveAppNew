import React from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '../assets/welcome.jpg';  // adjust the path according to your folder structure

function Home() {
  const navigate = useNavigate();

  const handleLetsGo = () => {
    navigate('/login'); // navigate to login page
  };

  return (
   <div
  style={{
    height: '100vh',
    backgroundImage: `url(${welcomeImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center',
    color: 'white', // if you want button text visible on image
  }}
>
 <h1>SAVEETHA's LEAVE MANAGEMENT APP</h1>
  
  <button
    onClick={handleLetsGo}
    style={{
      padding: '0.5rem 1rem',
      fontSize: '1.2rem',
      cursor: 'pointer',
      backgroundColor: 'rgba(0,0,0,0.6)',
      border: 'none',
      borderRadius: '5px',
      color: 'white',
    }}
  >
    Let's Go
  </button>
</div>

  );
}

export default Home;
