import React, { Component } from "react";
import "./Spinner.css";

class Spinner extends Component {
  render() {
    return (
      <div className="spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <br />
        Estamos procesando tu trabajo
      </div>
    );
  }
}

export default Spinner;
