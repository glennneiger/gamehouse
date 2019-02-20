import React from 'react';

var dt = new Date();

export default () => (
  <div className="Footer">
    <div className="contact">
      <h3>Contact</h3>
      <a href="tel:512.675.0046"> 
        <p>(512) 675-0046</p>
      </a>
      <a href="mailto:PestPreventionPlans@gmail.com">
        <p>PestPreventionPlans@gmail.com</p>
      </a>
    </div>
    <div className="copyright">
      © {dt.getYear()+1900} Pest Prevention Plans, LLC
    </div>
  </div>
)

