import React from "react"
import { render } from "react-dom"

import Header from "./components/Header"
import Filter from "./components/Filter"
import Search from "./components/Search"
import Summary from "./components/Summary"
import MainContent from "./components/MainContent"


import "../css/main.css"

class App1 extends React.Component {
    render() {
        return (
            <div id="app-container">
                <div id="header-container">
                    <Header/>
                </div>
                <div id="page-wrapper">
                    <div id="left-toolbar-container">
                        <Filter/>
                    </div>
                    <div id="main-content-container">
                        <MainContent/>
                    </div>
                    <div id="right-toolbar-container">
                        <Search/>
                    </div>
                </div>
                
            </div>
        )
    }
}

render(<App1/>, document.getElementById('App1'));