/**
 * Module Dependencies
 */

var styles = require('./index.css')
var DOM = require('react-dom')
var React = require('react')
var base = require('base')
console.log(styles);

var environment = process.env.NODE_ENV

/**
 * Dashboard Component
 */

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      Component: null
    }
  }

  componentDidMount () {
    var self = this
    require.ensure([], function(require) {
      self.setState({
        Component: require('../home/index.jsx')
      })
    })
  }

  render () {
    var Component = this.state.Component
    return (
      <div className="base">
        <div className='header'>Hola from dashboard!!!!!!!!!! we're running in the {environment} environment</div>
        <div className='content'>lorem ipsum</div>
        {Component ? <Component/> : <div></div>}
      </div>
    )
  }
}


if (typeof window !== 'undefined') {
  var props = JSON.parse(document.getElementById('state').textContent)
  DOM.render(<Dashboard {...props} />, document.getElementById('base'))
}
