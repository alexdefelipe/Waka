import React, { Component } from "react";
import "./ProcesarTrabajo.css";

class ProcesarTrabajo extends Component {
  nombreRef = React.createRef();
  descRef = React.createRef();
  file = null;

  handleOnChange = e => {
    var file = e.target.files[0];
    this.props.handleFileOnChange(file);
  };

  handleProcesar = event => {
    event.preventDefault();
    var nombre = this.nombreRef.current.value;
    var desc = this.descRef.current.value;
    this.props.procesarTrabajo(nombre, desc);
  };

  render() {
    return (
      <div className="procesar_trabajo">
        <div className="form">
          <h2>Configurar y subir trabajo</h2>
          <p>
            ¡Es el momento de configurar tu trabajo! Quizás en el futuro quieras
            consultar los resultados que vayas a obtener hoy, así que nosotros
            te lo ponemos fácil ;-)
          </p>
          <form
            className="mt-3"
            encType="multipart/form-data"
            onSubmit={this.handleOnSubmit}
          >
            <div className="form-group">
              <label htmlFor="nombre">
                <strong>Nombre</strong>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Dale un nombre al trabajo"
                id="nombre"
                ref={this.nombreRef}
              />
            </div>

            <div className="form-group">
              <label htmlFor="desc">
                <strong>Descripción</strong>
              </label>
              <textarea
                type="text"
                className="form-control"
                placeholder="Describe el trabajo, ¿qué cambios has hecho con respecto a trabajos previos?"
                id="desc"
                ref={this.descRef}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fichero_csv">
                <strong>
                  Selecciona el fichero CSV con la estructura apropiada
                </strong>
              </label>
              <input
                type="file"
                className="form-control-file"
                id="fichero_csv"
                onChange={this.handleOnChange}
              />
            </div>
            <button
              onClick={this.handleProcesar}
              className="btn btn-primary w-100 mt-3"
            >
              ¡Procesar!
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default ProcesarTrabajo;
