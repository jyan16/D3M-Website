import React from "react"
let echarts = require("echarts");
export default class MainContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { };
  }

  initChart() {
    let mychart = echarts.init(this.refs.main_graph);
    let data1 = [];
    let data2 = [];
    let data3 = [];

    let random = function (max) {
        return (Math.random() * max).toFixed(3);
    };

    for (let i = 0; i < 500; i++) {
        data1.push([random(15), random(10), random(1)]);
        data2.push([random(10), random(10), random(1)]);
        data3.push([random(15), random(10), random(1)]);
    }

    let option = {
        animation: false,
        legend: {
            data: ['scatter', 'scatter2', 'scatter3']
        },
        tooltip: {
        },
        xAxis: {
            type: 'value',
            min: 'dataMin',
            max: 'dataMax',
            splitLine: {
                show: true
            }
        },
        yAxis: {
            type: 'value',
            min: 'dataMin',
            max: 'dataMax',
            splitLine: {
                show: true
            }
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 1,
                end: 35
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                left: '93%',
                start: 29,
                end: 36
            },
            {
                type: 'inside',
                xAxisIndex: [0],
                start: 1,
                end: 35
            },
            {
                type: 'inside',
                yAxisIndex: [0],
                start: 29,
                end: 36
            }
        ],
        series: [
            {
                name: 'scatter',
                type: 'scatter',
                itemStyle: {
                    normal: {
                        opacity: 0.8
                    }
                },
                symbolSize: function (val) {
                    return val[2] * 40;
                },
                data: data1
            },
            {
                name: 'scatter2',
                type: 'scatter',
                itemStyle: {
                    normal: {
                        opacity: 0.8
                    }
                },
                symbolSize: function (val) {
                    return val[2] * 40;
                },
                data: data2
            },
            {
                name: 'scatter3',
                type: 'scatter',
                itemStyle: {
                    normal: {
                        opacity: 0.8,
                    }
                },
                symbolSize: function (val) {
                    return val[2] * 40;
                },
                data: data3
            }
        ]
    }
    mychart.setOption(option)
  }

  componentDidMount() {
    this.initChart();
  }

  render() {
      return (
            <div id="MainContent-wrapper">
              <div className="btn-group" role="group" aria-label="Basic example">
                  <div id="main-graph-tabs" className="btn-group" role="group">
                      <button className="btn btn-secondary" type="button">Tab 1</button>
                      <button className="btn btn-secondary" type="button">Tab 2</button>
                  </div>
              </div>
                <div ref="main_graph" id="main-graph">

                </div>
            </div>
        )
    }
}