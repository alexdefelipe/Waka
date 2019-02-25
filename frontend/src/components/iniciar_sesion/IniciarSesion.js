import React, { Component } from "react";
import "./IniciarSesion.css";

class IniciarSesion extends Component {
  usernameRef = React.createRef();
  passRef = React.createRef();
  rememberRef = React.createRef();

  handleIniciarSesion = event => {
    event.preventDefault();
    let username = this.usernameRef.current.value;
    let password = this.passRef.current.value;
    let remember = this.rememberRef.current.checked;
    console.log(remember);
    this.props.iniciarSesion(username, password, remember);
  };
  render() {
    return (
      <div className="iniciar_sesion">
        <div className="form">
          <h2>Iniciar sesión</h2>
          <form className="mt-3">
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                name="username"
                type="text"
                className="form-control"
                ref={this.usernameRef}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pass">Contraseña</label>
              <input
                name="pass"
                type="password"
                className="form-control"
                ref={this.passRef}
              />
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                ref={this.rememberRef}
              />
              <label className="form-check-label" htmlFor="remember">
                Mantener la sesión
              </label>
            </div>
            <button
              className="btn btn-primary w-100 mt-3"
              onClick={this.handleIniciarSesion}
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default IniciarSesion;
