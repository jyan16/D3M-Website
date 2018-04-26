import React from "react"

export default class SearchItem extends React.Component {
    constructor(props) {
        super(props);

        this.renderResult = this.renderResult.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        let target = $(event.currentTarget);
        console.log(event.currentTarget, $(event.currentTarget).attr('name'),$(event.currentTarget).attr('category'))
    }

    renderResult(entry) {
        return (
            <li className="search-item" onClick={this.handleClick} key={entry.name+'-'+entry.category} name={entry.name} category={entry.category}>
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