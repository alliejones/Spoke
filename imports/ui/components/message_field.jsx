import React, { Component } from 'react'
import TextField from 'material-ui/TextField'

const styles = {
  textarea: {
    padding: '0 20px 10px 20px',
  }
}

export class MessageField extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)

    this.state = {
      inputValue: props.initialScript
    }
  }

  componentWillReceiveProps(props) {
    const inputValue = props.initialScript
    this.setState({ inputValue })
  }

  getValue() {
    return this.refs.input.getValue()
  }

  handleChange(event) {
    this.setState({
      inputValue: event.target.value
    })
  }

  focus() {
    this.refs.input.focus()
  }
  render() {
    return (
      <div style={styles.textarea}>
      <TextField
        autoFocus
        onKeyDown={this.props.onKeyDown}
        ref="input"
        floatingLabelText="Your message"
        value={this.state.inputValue}
        onChange={this.handleChange}
        multiLine
        fullWidth
      />
    </div>
    )
  }
}
