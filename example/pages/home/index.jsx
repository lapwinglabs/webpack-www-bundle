/**
 * Module Dependencies
 */

var React = require('react')

/**
 * CSS
 */

var styles = require('./index.css')

/**
 * Home Component
 */

export default class Home extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      counter: 10
    }
    this.interval = setInterval(() => this.tick(), 5000);
  }

  tick() {
    this.setState({
      counter: this.state.counter + 90
    });
  }

  render () {
    return (
      <div className={styles.main}>Hello from Home {this.state.counter}!!</div>
    )
  }
}

// if (typeof window !== 'undefined') {
//   var state = JSON.parse(document.getElementById('state').textContent)
//   var component = React.createElement(Home, state)
//   React.render(component, document.getElementById('base'))
// }
