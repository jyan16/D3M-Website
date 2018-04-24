import React from "react"

export default class Search extends React.Component {
    render() {
        return (
            <div id="search-wrapper">
                <div className="input-group mb-2">
                    <input id="search-input" type="text" className="form-control" placeholder="Search Data..." aria-label="Search"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button">
                            <i className="fas fa-search" color="black"></i>
                        </button>
                    </div>
                </div>

                <select id="Search-type" className="form-control mb-2" style={{height:'25px'}}>
                    <option value="data">Data List</option>
                    <option value="attribute">Attribute List</option>
                </select>

                <div id="search-result">
                    <span className="label mb-2">
                        Search Result
                    </span>
                </div>

                
            </div>
        )
    }
}