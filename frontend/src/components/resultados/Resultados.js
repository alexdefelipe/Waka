import React, { Component } from "react";
import "./Resultados.css";
import { Bar } from "react-chartjs-2";
var Chart = require("chart.js");

const BarGraph = props => {
  return (
    <Bar
      data={{
        labels: ["Random Forest", "SVM", "kNN"],
        datasets: [
          {
            label: "Accuracy",
            data: props.data,
            backgroundColor: "#007bff"
          }
        ]
      }}
      options={{
        maintainAspectRatio: true,
        responsive: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
              // gridLines: {
              //   color: "rgba(0, 0, 0, 0)"
              // }
            }
          ],
          xAxes: [
            {
              barThickness: 73,
              categoryPercentage: 0.2,
              barPercentage: 0.2,
              gridLines: {
                color: "rgba(0, 0, 0, 0)"
              }
            }
          ]
        }
      }}
      height={250}
    />
  );
};

class Resultados extends Component {
  resultados = [];
  data = 0;

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
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
    this.props.cambioTrabajo(results_aux);
  };

  render() {
    const listaTrabajos = this.props.historialTrabajos.map(trabajo => (
      <li key={trabajo.id} onClick={() => this.handleOnClick(trabajo.id)}>
        {trabajo.name}
      </li>
    ));
    // const crearGrafico = data => {
    //   return <BarGraph data={this.props.data} />;
    // };
    var trabajoActual = 0;
    var data = this.props.data;
    return (
      <div className="resultados">
        {this.props.finished ? (
          <div className="contenido">
            <ul className="listado">{listaTrabajos}</ul>
            <div className="detalles">
              <div className="grafica">
                <BarGraph data={data} />
              </div>
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
