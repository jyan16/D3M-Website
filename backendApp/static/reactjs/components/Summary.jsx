import React from "react"

export default class Summary extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = { };
    }

    initChart() {
        let echarts = require("echarts")
        var xAxisData = [];
        var data1 = [];
        var data2 = [];
        for (var i = 0; i < 100; i++) {
            xAxisData.push('data ' + i);
            data1.push((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5);
            data2.push((Math.cos(i / 5) * (i / 5 -10) + i / 6) * 5);
        }

        let option = {
            title: {
                text: 'FML'
            },
            legend: {
                data: ['bar', 'bar2'],
                align: 'left'
            },
            toolbox: {
                // y: 'bottom',
                feature: {
                    magicType: {
                        type: ['stack', 'tiled'],
                        title: {
                            stack: 'stack',
                            tiled: 'tiled'
                        }
                    }
                }
            },
            tooltip: {},
            xAxis: {
                data: xAxisData,
                silent: false,
                splitLine: {
                    show: false
                }
            },
            yAxis: {
            },
            series: [{
                name: 'bar',
                type: 'bar',
                data: data1,
                animationDelay: function (idx) {
                    return idx * 10;
                }
            }, {
                name: 'bar2',
                type: 'bar',
                data: data2,
                animationDelay: function (idx) {
                    return idx * 10 + 100;
                }
            }],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            }
        };
        let mychart = echarts.init(this.refs.summary_graph)
        mychart.setOption(option)
    }

    componentDidMount() {
        this.initChart();
    }

    render() {
        return (
            <div id="summary-wrapper">
                <div ref="summary_graph" id="summary-graph"></div>
            </div>
        )
    }
}