import React from "react"
import { render } from "react-dom"

import Header from "./components/Header"

import "../css/normalize.css"

class App1 extends React.Component {
  render() {
    return (
      <Header />
    )
  }
}

render(<App1/>, document.getElementById('App1'))