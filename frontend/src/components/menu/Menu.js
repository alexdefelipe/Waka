import React, { Component } from "react";
import "./Menu.css";

class Menu extends Component {
  render() {
    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="/">
          Waka
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav justify-content-center d-flex flex-fill">
            <li className="nav-item active">
              <button
                className="btn btn-lg btn-primary"
                type="button"
                onClick={() => this.props.scroll("iniciar_sesion")}
              >
                Iniciar sesion
              </button>
            </li>

            <li className="nav-item active">
              <button
                className="btn btn-lg btn-primary"
                type="button"
                onClick={() => this.props.scroll("procesar_trabajo")}
              >
                Procesar trabajo <span className="sr-only">(current)</span>
              </button>
            </li>

            <li className="nav-item active">
              <button
                className="btn btn-lg btn-primary"
                type="button"
                onClick={() => this.props.scroll("resultados")}
              >
                Resultados
              </button>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Menu;
