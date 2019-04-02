import React from 'react';
import {signInWithGoogle} from '../../actions/auth';

export default ()=> (
  <div className="SignIn row">
    {/* <div id="facebook"><i className="fab fa-facebook-square"></i></div> */}

    <div id="google" onClick={signInWithGoogle}><i className="fab fa-google-plus-square"></i></div>

  </div>
)
