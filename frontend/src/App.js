import React, { Component } from "react";
import ReactDOM from "react-dom";
import IniciarSesion from "./components/iniciar_sesion/IniciarSesion";
import ProcesarTrabajo from "./components/procesar_trabajo/ProcesarTrabajo";
import Resultados from "./components/resultados/Resultados";
import Menu from "./components/menu/Menu";
import { ToastContainer, toast } from "react-toastify";

class App extends Component {
  state = {
    username: "",
    file: null
  };
  localhost = "http://localhost:5000";

  constructor(props) {
    super(props);
    this.iniciarSesionRef = React.createRef();
    this.procesarTrabajoRef = React.createRef();
    this.resultadosRef = React.createRef();
  }

  iniciarSesion = (username, password, remember) => {
    this.setState({ username: username });
    this.scroll("procesar_trabajo");
  };

  procesarTrabajo = (nombre, desc) => {
    // Prepare data
    var formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("username", this.state.username);
    formData.append("trabajo", nombre);

    // Prepare request
    var request = new XMLHttpRequest();
    request.open("POST", `${this.localhost}/procesar`);
    request.onreadystatechange = (request => {
      if (request.readyState === 4 && request.status === 200) {
        var response = JSON.parse(request.responseText);
        if (response.code !== 200) {
          this.lanzarToast("error", response.message);
        } else {
          this.scroll("resultados");
        }
      } else {
        // No sé por qué, me devuelve dos respuestas, una de ellas vacía.
        // Lo filtro con este if
        if (request.responseText != undefined) {
          var response = JSON.parse(request.responseText);
          console.log(response);
          this.lanzarToast("error", response.message);
        }
      }
    }).bind(undefined, request);

    // Send request
    request.send(formData);

    this.lanzarToast("error", "E");
  };

  handleFileOnChange = file => {
    this.setState({ file: file });
  };

  scroll = ref => {
    var domNode;
    var bodyRect = document.body.getBoundingClientRect();

    if (ref === "iniciar_sesion") {
      domNode = ReactDOM.findDOMNode(this.iniciarSesionRef.current);
    } else if (ref === "resultados") {
      domNode = ReactDOM.findDOMNode(this.resultadosRef.current);
    } else {
      domNode = ReactDOM.findDOMNode(this.procesarTrabajoRef.current);
    }

    var componentBounds = domNode.getBoundingClientRect();
    var offset = componentBounds.top - bodyRect.top - 55;

    window.scrollTo(0, offset);
  };

  lanzarToast = (tipo, mensaje) => {
    if (tipo === "success") {
      toast.success(mensaje, {
        position: "bottom-center",
        autoClose: 3500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } else if (tipo === "error") {
      toast.error(mensaje, {
        position: "bottom-center",
        autoClose: 3500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  render() {
    return (
      <>
        <Menu scroll={this.scroll} />
        <div>
          <IniciarSesion
            iniciarSesion={this.iniciarSesion}
            className="mt-5"
            ref={this.iniciarSesionRef}
          />
          <ProcesarTrabajo
            handleFileOnChange={this.handleFileOnChange}
            procesarTrabajo={this.procesarTrabajo}
            ref={this.procesarTrabajoRef}
          />
          <Resultados ref={this.resultadosRef} />
        </div>
        <div>
          <ToastContainer
            position="bottom-center"
            autoClose={3500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />
        </div>
      </>
    );
  }
}

export default App;
