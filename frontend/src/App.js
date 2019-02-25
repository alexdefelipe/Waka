import React, { Component } from "react";
import ReactDOM from "react-dom";
import IniciarSesion from "./components/iniciar_sesion/IniciarSesion";
import ProcesarTrabajo from "./components/procesar_trabajo/ProcesarTrabajo";
import Resultados from "./components/resultados/Resultados";
import Spinner from "./components/spinner/Spinner";
import Menu from "./components/menu/Menu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

class App extends Component {
  state = {
    username: "alex",
    historialTrabajos: [],
    dataGrafico: [],
    file: null,
    workInProgress: false,
    workFinished: false
  };

  localhost = "http://localhost:5000";

  constructor(props) {
    super(props);
    this.iniciarSesionRef = React.createRef();
    this.procesarTrabajoRef = React.createRef();
    this.resultadosRef = React.createRef();
  }

  componentDidMount() {
    this.scroll("iniciar_sesion");
    // this.iniciarSesion("alex", "alex", false);
    // this.setState({ workFinished: true });
    // this.scroll("resultados");
  }

  iniciarSesion = (username, password, remember) => {
    fetch(`${this.localhost}/iniciarSesion`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        remember: remember
      })
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response);
        }
        return response.json();
      })
      .then(response => {
        let payload = response.payload;
        this.setState({ username: payload.username });

        fetch(`http://localhost:5000/${payload.username}/trabajos`)
          .then(response => {
            if (!response.ok) {
              throw Error(response);
            }
            return response.json();
          })
          .then(res => {
            this.setState({ historialTrabajos: res.works });
          });

        response.remember
          ? localStorage.setItem("token", payload.username)
          : sessionStorage.setItem("token", payload.username);

        // Lanzar el toast y cerrar el diálogo
        this.lanzarToast("success", `¡Sesión iniciada satisfactoriamente :)!`);
        this.scroll("procesar_trabajo");
      })
      .catch(error => {
        this.lanzarToast("error", `No se ha podido iniciar sesion.`);
        console.log(error);
      });
  };

  procesarTrabajo = (nombre, desc) => {
    // Prepare data
    var formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("username", this.state.username);
    formData.append("trabajo", nombre);
    formData.append("desc", desc);
    this.setState({ workInProgress: true });
    fetch(`${this.localhost}/procesar`, {
      method: "POST",
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response);
        }
        return response.json();
      })
      .then(response => {
        fetch(`${this.localhost}/${this.state.username}/trabajos`)
          .then(response => {
            if (!response.ok) {
              throw Error(response);
            }
            return response.json();
          })
          .then(response => {
            this.setState({ historialTrabajos: response.works });
          })
          .catch(error => {
            console.log(error);
          });
        this.setState({
          workInProgress: false,
          workFinished: true
        });

        this.lanzarToast("success", "Trabajado procesado correctamente");
        this.scroll("resultados");
      })
      .catch(error => {
        this.setState({ workInProgress: false });
        this.lanzarToast(
          "error",
          `No se ha podido procesar el trabajo. ¿Has adjuntado un fichero CSV?`
        );
      });
  };

  handleFileOnChange = file => {
    this.setState({ file: file });
  };

  handleCambioTrabajo = data => {
    this.setState({ dataGrafico: data });
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
      <div>
        <Menu scroll={this.scroll} />
        <IniciarSesion
          iniciarSesion={this.iniciarSesion}
          className="mt-5"
          ref={this.iniciarSesionRef}
        />
        {this.state.workInProgress ? (
          <Spinner />
        ) : (
          <ProcesarTrabajo
            handleFileOnChange={this.handleFileOnChange}
            procesarTrabajo={this.procesarTrabajo}
            ref={this.procesarTrabajoRef}
          />
        )}
        <Resultados
          finished={this.state.workFinished}
          ref={this.resultadosRef}
          data={this.state.dataGrafico}
          ruta={`http://localhost:5000/var/upload/csvs/${this.state.username}`}
          historialTrabajos={this.state.historialTrabajos}
          cambioTrabajo={this.handleCambioTrabajo}
        />
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
      </div>
      // <>
      //   <Menu scroll={this.scroll} />
      //   <div>
      //     <IniciarSesion
      //       iniciarSesion={this.iniciarSesion}
      //       className="mt-5"
      //       ref={this.iniciarSesionRef}
      //     />
      //
      //     {this.state.workInProgress ? (
      //       <div class="spinner-border text-primary" role="status">
      //         <span class="sr-only">Loading...</span>
      //       </div>
      //     ) : (
      // <ProcesarTrabajo
      //   handleFileOnChange={this.handleFileOnChange}
      //   procesarTrabajo={this.procesarTrabajo}
      //   ref={this.procesarTrabajoRef}
      // />
      //     )}
      //     <Resultados ref={this.resultadosRef} />
      //   </div>
      // <div>
      //   <ToastContainer
      //     position="bottom-center"
      //     autoClose={3500}
      //     hideProgressBar
      //     newestOnTop={false}
      //     closeOnClick
      //     rtl={false}
      //     pauseOnVisibilityChange
      //     draggable
      //     pauseOnHover
      //   />
      // </div>
      // </>
    );
  }
}

export default App;
