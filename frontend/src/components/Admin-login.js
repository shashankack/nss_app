import React from 'react';
import './Admin-login.css'; // Import your CSS file
import Sunset from '../assets/Sunset.mp4';

const LoginPage = () => {
  return (
    <div className="video-container">
      <video className="video-background" autoPlay loop muted>
        <source src={Sunset} type="video/mp4" />
      </video>

      <div className="box-container">
        <div className="box-form">
          <div className="left">
            <div className="overlay">
              {/* Your overlay content */}
            </div>
          </div>
          <div className="right">
            <div style={{ color: 'black' }}>
              <h4><b>NOT YOU , BUT ME</b></h4>
            </div>
            <div style={{ color: 'black' }}>
              <h3><b>Login</b></h3>
            </div>
            <div className="inputs" style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="text"
                placeholder="Username"
                style={{
                  padding: '12px',
                  marginBottom: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  fontFamily: 'Arial, sans-serif',
                }}
              />
              <input
                type="password"
                placeholder="Password"
                style={{
                  padding: '12px',
                  marginBottom: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  fontFamily: 'Arial, sans-serif',
                }}
              />
            </div>
            <button className="btn btn-outline-success btn-sm" type="submit">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
