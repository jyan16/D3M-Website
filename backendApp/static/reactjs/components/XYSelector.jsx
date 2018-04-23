import React from "react"

export default class XYSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xAxisIndex: 0,
            yAxisIndex: 1,
            options: []
        }
        this.renderOptions = this.renderOptions.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    renderOptions() {
        if (this.props.data == null) {
            return ''
        }

        let results = this.props.data[this.props.currentCatagory]
        if (results.length == 0) {
            return ''
        }
        let options = Object.keys(results[0].most_recent_result);
        this.state.options = options;
        return options.map(function(op, index){
            return <option value={index} key={'xyselector-'+op}>{op}</option>
        });
    }

    handleChange(event) {
        if (event.target.id == 'XSelector') {
            this.setState({xAxisIndex: event.target.value});
            this.props.rootThis.setState({xAxis: this.state.options[event.target.value]});
        } else {
            this.setState({yAxisIndex: event.target.value});
            this.props.rootThis.setState({yAxis: this.state.options[event.target.value]});
        }
    }

    render() {
        return (
            <div id="xySelectorWrapper">
                <label htmlFor="xAxis">X Axis</label>
                <select name="xAxis" id="XSelector" value={this.state.xAxisIndex} onChange={this.handleChange}>
                    {this.renderOptions()}
                </select>
                <label htmlFor="yAxis">Y Axis</label>
                <select name="yAxis" id="YSelector" value={this.state.yAxisIndex} onChange={this.handleChange}>
                    {this.renderOptions()}
                </select>
            </div>
        )
    }
}