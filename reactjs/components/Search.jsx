import React from "react"

export default class Search extends React.Component {
    render() {
        return (
            <div id="Search-wrapper">
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Search" aria-label="Search"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button">Button</button>
                    </div>
                </div>

                <select id="Search-type" className="form-control">
                    <option value="data">Data List</option>
                    <option value="attribute">Attribute List</option>
                </select>

                <span className="label">
                    Search Result
                </span>
            </div>
        )
    }
}