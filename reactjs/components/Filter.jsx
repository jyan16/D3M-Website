import React from "react"

import FilterItem from "./FilterItem"

export default class Filter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [{name:"attr1", relation:"lt", value:2}]
        };
    }


  render() {
    return (
      <div id="filter-wrapper">
        <span className="label">
            Filter
        </span>
        
        <div id="filter-form">
            <input type="text" className="form-control" id="filter-form-attribute" placeholder="attribute name"/>
            <div>
                <select id="filter-form-relation" className="form-control">
                    <option value="lt">&lt;</option>
                    <option value="le">&le;</option>
                    <option value="eq">&#61;</option>
                    <option value="ne">&ne;</option>
                    <option value="ge">&ge;</option>
                    <option value="gt">&gt;</option>
                </select>
                <input type="number" className="form-control" id="filter-form-value" placeholder="value"/>
            </div>
            <button className="btn btn-primary" id="filter-form-add">
                Add
            </button>
            <button className="btn btn-primary" id="filter-form-apply">
                Apply Filter
            </button>
        </div>

        <FilterItem data={this.state.filters}/>
      </div>
    )
  }
}