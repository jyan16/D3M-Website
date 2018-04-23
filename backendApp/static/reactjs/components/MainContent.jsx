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
            main_chart: null,
            summary_chart: null,
            statistics: null
        };

        this.render = this.render.bind(this);
        this.retrieveData = this.retrieveData.bind(this);
        this.formatDataForMainGraph = this.formatDataForMainGraph.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.updateChartForDataset = this.updateChartForDataset.bind(this);
        this.updateSummaryChart = this.updateSummaryChart.bind(this);
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
                    let summarychart = echarts.init(mythis.refs.summary_graph);
                    mythis.setState({
                        data: data.data,
                        catagoryList: cl,
                        currentCatagory: cl[0],
                        xAxis: axis[0],
                        yAxis: axis[1],
                        main_chart: mychart,
                        summary_chart: summarychart,
                        statistics: data.statistics,
                    });
                    mychart.on('click', function (params) {
                        $.ajax({
                            url: location.origin + "/dataset/?data_name=" + params.data[2].name,
                            type: "GET",
                            success: function(data) {
                                mythis.updateChartForDataset(data);
                                mythis.updateSummaryChartForDataset(data);
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

        let now = new Date();
        let t = Math.round((now-new Date(entry.most_recent_time))/(1000*60*60*24));
        return [x,y, entry, t];
    }

    updateSummaryChartForDataset(raw) {
        let summarychart = this.state.summary_chart;
        summarychart.clear();
    }

    updateSummaryChart() {
        let summarychart = this.state.summary_chart;
        summarychart.clear();
        let statistics = this.state.statistics;


    }

    updateChartForDataset(raw) {
        let mychart = echarts.init(this.refs.main_graph);
        mychart.clear();
        $("#xySelectorWrapper").hide();
        let data = raw.results;
        if (data.length == 0) {
            alert('not enough data for '+raw.dataset.name);
            return;
        }

        let dimensions = [];
        let ys = [];
        for (let i = 0; i < data.length; i++) {
            for (let key in data[i]) {
                if (dimensions.includes(key) == false) {
                    dimensions.push(key);
                    if (key != 'time') {
                        ys.push(key);
                    }
                }
            }
        }

        let series = [];
        for (let i = 0; i < ys.length; i++) {
            let s = {
                type: ys[i].endsWith('Duration')?'bar':'line',
                yAxisIndex: ys[i].endsWith('Duration')?1:0,
                name: ys[i],
                dimensions: ['time', ys[i]],
                encode: {
                    x: 'time',
                    y: ys[i],
                    tooltip: ys[i]
                }
            }
            series.push(s);
        }

        let option = {
            dataset: {
                source : data
            },
            animation: true,
            legend: {
                show: true,
                // type: 'scroll',
                width: '70%',
                left: '15%',
            },
            grid: {
                left: '15%',
                right: '15%',
                bottom: '15%'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {
                type: 'time',
                name: 'Time',
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameLocation: 'middle',
                nameGap: 30,
                min: 'dataMin',
                max: 'dataMax',
                splitLine: {
                    show: true
                }
            },
            yAxis: [{
                type: 'value',
                scale: true,
                nameLocation: 'middle',
                name: 'score',
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameGap: 30,
                min: function(val) {
                    return Math.round((val.min * 1.1)*1000)/1000;
                },
                max: function(val) {
                    return Math.round((val.max * 1.1)*1000)/1000;
                },
                splitLine: {
                    show: true
                }
            }, {
                type: 'value',
                scale: true,
                nameLocation: 'middle',
                position: 'right',
                name: 'duration',
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameGap: 30,
                min: function(val) {
                    return Math.round((val.min * 1.1)*1000)/1000;
                },
                max: function(val) {
                    return Math.round((val.max * 1.1)*1000)/1000;
                },
                splitLine: {
                    show: true
                }
            }],
            dataZoom: [{
                type: 'slider',
                filterMode: 'filter',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100
            },
            {
                type: 'inside',
                filterMode: 'filter',
                xAxisIndex: [0],
                start: 0,
                end: 100
            },
            {
                type: 'slider',
                filterMode: 'filter',
                show: true,
                yAxisIndex: [0],
                left: '0%',
                start: 0,
                end: 100
            },
            // {
            //     type: 'inside',
            //     filterMode: 'filter',
            //     yAxisIndex: [0],
            //     start: 0,
            //     end: 100
            // },
            {
                type: 'slider',
                filterMode: 'filter',
                show: true,
                yAxisIndex: [1],
                right: '0%',
                start: 0,
                end: 100
            },
            // {
            //     type: 'inside',
            //     filterMode: 'filter',
            //     yAxisIndex: [1],
            //     start: 0,
            //     end: 100
            // }
            ],
            series: series
        }

        mychart.setOption(option);
    }

    updateChart() {
        let mychart = this.state.main_chart;
        mychart.clear();
        $("#xySelectorWrapper").show();
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
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameLocation: 'middle',
                nameGap: 30,
                min: function(val) {
                    return Math.round((val.min * 1.1)*1000)/1000;
                },
                max: function(val) {
                    return Math.round((val.max * 1.1)*1000)/1000;
                },
                splitLine: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                name: mythis.state.yAxis,
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameLocation: 'middle',
                nameGap: 30,
                min: function(val) {
                    return Math.round((val.min * 1.1)*1000)/1000;
                },
                max: function(val) {
                    return Math.round((val.max * 1.1)*1000)/1000;
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
                    // itemStyle: {
                    //     normal: {
                    //         opacity: 0.8,
                    //         color: function(params) {
                    //             let date = new Date(data[params.dataIndex][2].most_recent_time);
                    //             let alpha = date / now;
                    //             let start = [194,53,49].map(x=>x*alpha);
                    //             let end = [245,191,198].map(x=>x*(1-alpha));
                    //             let combine = [];
                    //             for (let i = 0; i < 3; i++) {
                    //                 combine.push(start[i]+end[i]);
                    //             }
                    //             return 'rgb('+combine[0]+','+combine[1]+','+combine[2]+')';
                    //         }
                    //     }
                    // },
                    symbolSize: function (val, params) {
                        let a = 50;
                        if (xmax == xmin || ymax == ymin) {
                            return [val[0]/val[1] * a, 1 * a];
                        }
                        return [(val[0]-xmin)/(xmax-xmin) * a, (val[1]-ymin)/(ymax-ymin) * a];
                    },
                    data: data
                }
            ],
            visualMap: {
                type: 'piecewise',
                pieces: [
                    {
                        lte: 3,
                        color: 'rgb(194,53,49)'
                    }, {
                        gt: 3, lte: 7,
                        color: 'rgb(240,80,57)'
                    }, {
                        gt: 7, lte: 15,
                        color: 'rgb(255,255,50)'
                    }, {
                        gt: 15, lte: 30,
                        color: 'rgb(76,255,76)'
                    }, {
                        gt: 30, lte: 60,
                        color: 'rgb(50,50,255)'
                    }, {
                        gt: 60, lte: 120,
                        color: 'rgb(110,50,155)'
                    } , {
                        gt: 120, lte: 180,
                        color: 'rgb(201,127,233)'
                    }
                ],
                top: 0,
                left: '10%',
                orient: 'horizontal',
                text: ['Far', 'Near'],
                
            }
        }
        mychart.setOption(option)
        this.updateSummaryChart();
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