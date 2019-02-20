import React from 'react';
import {Link} from 'react-router-dom';

export default () => (
  <div className="Navbar">
    <div className="content">
      <div className="home">
        <Link to="/">Jacob's Game House</Link>
      </div>
      <div className="links">
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
        <a href="https://www.facebook.com/Pest-Prevention-Plans-LLC-711974715805332/"  rel="noopener noreferrer" target="_blank" className="social"><i className="fab fa-facebook-f"></i></a>
      </div>
    </div>
  </div>
)


