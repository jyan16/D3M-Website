import React from "react"
let echarts = require("echarts");
export default class MainContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            xAxis: '',
            yAxis: '',
            catagory: '',
            data: null
        };

        this.retrieveData = this.retrieveData.bind(this);

        this.retrieveData();
    }

    retrieveData() {
        $.ajax({
            url: location.origin + "/all",
            type: "GET",
            success: function(data) {
                if (data.ok == true) {
                    delete data.ok;
                    this.state.data = data;
                } else {
                    alert('Invalid data returned!');
                }
            },
            error: function() {
                alert('Cannot retrieve data!');
            },
        });
    }

    initChart() {
        return;
        let mychart = echarts.init(this.refs.main_graph);

        let data = this.state.data;

        let option = {
            animation: false,
            legend: {},
            tooltip: {},
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
            dataZoom: [{
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
            series: [{
                    name: 'data',
                    type: 'scatter',
                    itemStyle: {
                        normal: {
                            opacity: 0.8
                        }
                    },
                    symbolSize: function (val) {
                        return (val[0] + val[1]) * 40;
                    },
                    data: data
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
                        < button className="btn btn-secondary" type="button"> Tab 1</button>
                        < button className="btn btn-secondary" type="button"> Tab 2</button>
                    </div>
                </div>
                    <div ref="main_graph" id="main-graph">
                </div>
            </div>
        )
    }
}