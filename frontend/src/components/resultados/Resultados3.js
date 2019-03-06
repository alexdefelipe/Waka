import React, { Component } from "react";
import "./Resultados.css";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

class Resultados extends Component {
  resultados = [];
  data = 0;

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidMount() {
    // this.handleOnClick(0);
  }

  handleOnClick = id => {
    var aux = this.props.historialTrabajos[id - 1].results;
    aux = JSON.parse(aux);
    var results_aux = [];

    for (var key in aux) {
      if (aux.hasOwnProperty(key)) {
        switch (key) {
          case "rf":
            results_aux.push(aux[key][0]);
            break;
          case "svm":
            results_aux.push(aux[key][0]);
            break;
          case "knn":
            results_aux.push(aux[key][0]);
            break;
          default:
            continue;
        }
      }
    }
    aux = [
      {
        name: "Trabajo1",
        rf: aux["rf"][0],
        svm: aux["svm"][0],
        knn: aux["knn"][0]
      }
    ];
    this.props.cambioTrabajo(aux);
  };

  render() {
    const listaTrabajos = this.props.historialTrabajos.map(trabajo => (
      <li key={trabajo.id} onClick={() => this.handleOnClick(trabajo.id)}>
        {trabajo.name}
      </li>
    ));

    var trabajoActual = 0;
    var data = this.props.data;
    return (
      <div className="resultados">
        {this.props.finished ? (
          <div className="contenido">
            <ul className="listado">{listaTrabajos}</ul>
            <div className="detalles">
              {/* <div className="grafica">*/}
              <BarChart
                width={800}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rf" fill="#8884d8" />
                <Bar dataKey="svm" fill="#82ca9d" />
                <Bar dataKey="knn" fill="#ffc658" />
              </BarChart>
              {/*}</div>*/}
              <div className="enlaces">
                <p>
                  Consulta el resultado del análisis de componentes principales{" "}
                  {/*<a
                    href={`${this.props.ruta}/${this.props.trabajo.id}/${
                      this.props.trabajo.id
                    }.pca.png`}
                  >
                    aquí
                  </a>*/}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>Debes enviar un trabajo a procesar primero</p>
        )}
      </div>
    );
  }
}

export default Resultados;
