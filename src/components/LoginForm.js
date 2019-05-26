import React, { Component } from 'react';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const {socket, setUsername} = this.props
    const { username } = this.state
    if(username){
      // Tell the server your username
      socket.emit('add user', username);
    }
    setUsername(username)
  }

  render() {
    const {username} = this.state

    return (
      <form className="login" onSubmit={this.handleSubmit}>
        <div className="login-form">
          <label htmlFor="username"><h2>What's your username?</h2></label>
          <input id="username"
            value={username}
            onChange={e => {this.setState({username:e.target.value})}}
            type="text"
            maxLength="14" />
        </div>
      </form>
    );
  }

}

export default LoginForm;
