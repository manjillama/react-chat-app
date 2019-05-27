import React, { Component } from 'react';
import { VERIFY_USER, ADD_USER } from '../events';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      error: null,
      socket: null
    };
  }

  componentWillMount(){
    const {socket} = this.props
    this.setState({socket});
  }

  handleSubmit = e => {
    e.preventDefault();
    const { socket, username } = this.state
    if(username){
      // Tell the server your username
      socket.emit(VERIFY_USER, username, this.setUsername);
    }
  }

  setUsername = ({username, isUser}) => {
    const {setUsername} = this.props
    const {socket} = this.state;
    if(isUser){
      this.setError("Username taken")
    }else{
      this.setError(null)
      socket.emit(ADD_USER, username);
      setUsername(username)
    }
  }


  setError = error => {
    this.setState({error})
  }

  render() {
    const {username, error} = this.state

    return (
      <form className="login" onSubmit={this.handleSubmit}>
        <div className="login-form">
          <label htmlFor="username"><h2>What's your username?</h2></label>
          <input id="username"
            value={username}
            onChange={e => {this.setState({username:e.target.value})}}
            type="text"
            autoComplete="off"
            maxLength="14" />
          <div className="error">{error ? error : null}</div>

        </div>
      </form>
    );
  }

}

export default LoginForm;
