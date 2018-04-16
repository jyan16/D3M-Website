import React from "react"

import FilterItem from "./FilterItem"

export default class Filter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: []
        };

        this.addfilter = this.addfilter.bind(this);
        this.applyfilters = this.applyfilters.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);      
        
        this.state.removeFilter = this.removeFilter;
    }

    addfilter(event) {
        event.preventDefault();

        let name = $("#filter-form-attribute");
        let relation = $("#filter-form-relation");
        let value = $("#filter-form-value");

        this.state.filters.push({id: this.state.filters.length, name: name.val(), relation: relation.val(), value: parseFloat(value.val())});

        name.val('');
        // relation.val('lt');
        value.val('');

        this.updateFilter();
    }

    applyfilters(event) {
        event.preventDefault();

        alert("applyfilters not implemented");
    }

    removeFilter(event) {
        // event.preventDefault();

        console.log(event.currentTarget);

        this.updateFilter();
    }

    updateFilter() {
        this.setState({filters: this.state.filters});
    }

  render() {
    return (
      <div id="filter-wrapper">
        <span className="label">
            Filter
        </span>
        
        <div id="filter-form">
            <form onSubmit={this.addfilter}>
                <input type="text" className="form-control" id="filter-form-attribute" placeholder="attribute name" required/>
                <div>
                    <select id="filter-form-relation" className="form-control" required>
                        <option value="lt">&lt;</option>
                        <option value="le">&le;</option>
                        <option value="eq">&#61;</option>
                        <option value="ne">&ne;</option>
                        <option value="ge">&ge;</option>
                        <option value="gt">&gt;</option>
                    </select>
                    {/* <input type="number" className="form-control" id="filter-form-value" placeholder="value" step="0.01" required/> */}
                    <input type="text" className="form-control" id="filter-form-value" placeholder="value" pattern="^[+-]?([0-9]*[.])?[0-9]+$" required/>                    
                    
                </div>
                <button className="btn btn-primary" id="filter-form-add" type="submit">
                    Add
                </button>
            </form>
            <button className="btn btn-primary" id="filter-form-apply" onClick={this.applyfilters}>
                    Apply Filter
            </button>
        </div>
        

        <FilterItem data={this.state.filters} removeFilter={this.state.removeFilter}/>
      </div>
    )
  }
}