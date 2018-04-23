import React from "react"
import Catagory from "./Catagory"
import XYSelector from "./XYSelector"
let echarts = require("echarts");

export default class MainContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            xAxis: 'baseline',
            yAxis: 'our',
            currentCatagory: null,
            catagoryList: [],
            data: null,
            main_chart: null
        };

        this.render = this.render.bind(this);
        this.retrieveData = this.retrieveData.bind(this);
        this.formatDataForMainGraph = this.formatDataForMainGraph.bind(this);
        this.updateChart = this.updateChart.bind(this);
    }

    retrieveData() {
        let mythis = this;
        $.ajax({
            url: location.origin + "/all",
            type: "GET",
            success: function(data) {
                if (data.ok == true) {
                    let cl = Object.keys(data.data);
                    let axis = Object.keys(data.data[cl[0]][0].most_recent_result)
                    let mychart = echarts.init(mythis.refs.main_graph);
                    mythis.setState({
                        data: data.data,
                        catagoryList: cl,
                        currentCatagory: cl[0],
                        xAxis: axis[0],
                        yAxis: axis[1],
                        main_chart: mychart
                    });
                    mychart.on('click', function (params) {
                        console.log(params)
                        $.ajax({
                            url: location.origin + "/dataset/?data_name=" + params.data[2].name,
                            type: "GET",
                            success: function(data) {
                                mythis.updateChartForDataset(data);
                            },
                            error: function() {
                                alert('error retrieving data');
                            }
                        });
                    });
                } else {
                    alert('Invalid data returned!');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error retrieving data');
            }
        });
    }

    formatDataForMainGraph(entry) {
        let x = entry.most_recent_result[this.state.xAxis];
        let y = entry.most_recent_result[this.state.yAxis];
        return [x,y, entry];
    }

    updateChartForDataset(raw) {
        let mychart = this.state.main_chart;

        let data = raw.results;

        let option = {
            animation: true,
            legend: {
                show: true
            },
            tooltip: {

            },
            xAxis: {
                type: 'time',
                name: 'Time',
                nameLocation: 'middle',
                nameGap: 30,
                min: function(val) {
                    return val.min - Math.abs(val.min*0.1);
                },
                max: function(val) {
                    return val.max + Math.abs(val.max*0.1);
                },
                splitLine: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                nameLocation: 'middle',
                nameGap: 30,
                min: function(val) {
                    return val.min - Math.abs(val.min*0.1);
                },
                max: function(val) {
                    return val.max + Math.abs(val.max*0.1);
                },
                splitLine: {
                    show: true
                }
            },
            series: [
                
            ]
        }

        //mychart.setOption(option);
    }

    updateChart() {
        let mychart = this.state.main_chart;
        let data = this.state.data[this.state.currentCatagory].map(this.formatDataForMainGraph);

        let xs = data.map(d => d[0]);
        let ys = data.map(d => d[1]);

        let xmin = Math.min.apply(null, xs);
        let xmax = Math.max.apply(null, xs);

        let ymin = Math.min.apply(null, ys);
        let ymax = Math.max.apply(null, ys);

        let mythis = this;
        let now = new Date();
        let option = {
            animation: true,
            legend: {
                show: false
            },
            tooltip: {
                formatter: function(params) {
                    let info = JSON.stringify(params.data[2], null, 4);
                    return '<pre>' + info + '</pre>';
                }
            },
            grid: {
                right: '15%',
                bottom: '15%'
            },
            xAxis: {
                type: 'value',
                name: mythis.state.xAxis,
                nameLocation: 'middle',
                nameGap: 30,
                min: function(val) {
                    return val.min - Math.abs(val.min*0.1);
                },
                max: function(val) {
                    return val.max + Math.abs(val.max*0.1);
                },
                splitLine: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                name: mythis.state.yAxis,
                nameLocation: 'middle',
                nameGap: 30,
                min: function(val) {
                    return val.min - Math.abs(val.min*0.1);
                },
                max: function(val) {
                    return val.max + Math.abs(val.max*0.1);
                },
                splitLine: {
                    show: true
                }
            },
            dataZoom: [{
                    type: 'slider',
                    filterMode: 'weakFilter',
                    show: true,
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                },
                {
                    type: 'slider',
                    filterMode: 'weakFilter',
                    show: true,
                    yAxisIndex: [0],
                    left: '93%',
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    filterMode: 'weakFilter',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    filterMode: 'weakFilter',
                    yAxisIndex: [0],
                    start: 0,
                    end: 100
                }
            ],
            series: [{
                    name: mythis.state.currentCatagory,
                    type: 'scatter',
                    itemStyle: {
                        normal: {
                            opacity: 0.8,
                            color: function(params) {
                                let date = new Date(data[params.dataIndex][2].most_recent_time);
                                let alpha = date / now;
                                let start = [194,53,49].map(x=>x*alpha);
                                let end = [245,191,198].map(x=>x*(1-alpha));
                                let combine = [];
                                for (let i = 0; i < 3; i++) {
                                    combine.push(start[i]+end[i]);
                                }
                                return 'rgb('+combine[0]+','+combine[1]+','+combine[2]+')';
                            }
                        }
                    },
                    symbolSize: function (val, params) {
                        let a = 50;
                        if (xmax == xmin || ymax == ymin) {
                            return [val[0]/val[1] * a, 1 * a];
                        }
                        return [(val[0]-xmin)/(xmax-xmin) * a, (val[1]-ymin)/(ymax-ymin) * a];
                    },
                    data: data
                }
            ]
        }
        mychart.setOption(option)
    }

    componentDidMount() {
        this.retrieveData();
    }

    componentDidUpdate() {
        this.updateChart();
    }

    render() {
        return (
            <div id="MainContent-wrapper">
                <Catagory catagoryList={this.state.catagoryList} rootThis={this}/>
                <div ref="main_graph" id="main-graph"></div>
                <div ref="summary_graph" id="summary-graph"></div>
                
                <XYSelector data={this.state.data} currentCatagory={this.state.currentCatagory} rootThis={this}/>
                
            </div>
        )
    }
}