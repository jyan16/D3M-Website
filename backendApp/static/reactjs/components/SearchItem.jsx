import React from "react"
let echarts = require('echarts')
export default class SearchItem extends React.Component {
    constructor(props) {
        super(props);

        this.renderResult = this.renderResult.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        let target = $(event.currentTarget);
        let to = this.props.categoryList.indexOf(target.attr('category'));

        document.getElementById('filter-form-removeall').click();
        let indicators = $('#carouselIndicators');
        if (indicators.attr('activeIndex') != to) {
            console.log(indicators.attr('activeindex'))
            indicators.carousel(to);
        } else {
            document.getElementById('filter-form-apply').click();
        }
        let instance = echarts.getInstanceByDom(document.getElementById('main-graph'));
        setTimeout(function(){
            instance.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: target.attr('index'),
            });
            setTimeout(function(){
                instance.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: target.attr('index'),
                });
            }, 1500);
        }, 300);
        
    }

    renderResult(entry) {
        return (
            <li className="search-item" onClick={this.handleClick} key={entry.name+'-'+entry.category} name={entry.name} category={entry.category} index={entry.index}>
                <div className="search-item-name">{entry.name}</div>
                <div className="search-item-category">{entry.category}</div>
            </li>
        )
    }

    render() {
        return (
            <ul id="search-result" className="list-group">
                {this.props.results.map(this.renderResult)}
            </ul>
        )
    }
}