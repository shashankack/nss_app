import React from 'react';

const Navbar = () => {
  const logoUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_UrJs469Jl1jKMEdC7OpoOe6cvToaq96a3KpLngBxfg&s';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ padding: '1rem' }}>
      <div className="container-fluid" style={{ padding: '0' }}>
        <img src={logoUrl} alt="Logo" className="navbar-logo" style={{ width: '50px', height: '50px' }} />
        {/* <a className="navbar-brand" href="#" style={{ fontSize: '1.5rem', marginLeft: '10px' ,fontFamily: 'Open Sans, sans-serif'}}><h3><b></b></h3></a> */}
           <a className="navbar-brand" href="#" style={{ fontSize: '1.5rem', marginLeft: '10px' ,fontFamily: 'Open Sans, sans-serif'}}><h3><b>"NOT YOU BUT ME"</b></h3></a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ paddingLeft: '1rem' }}>
          
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
