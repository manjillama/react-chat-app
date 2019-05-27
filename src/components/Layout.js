import React, { Component } from 'react'
import io from 'socket.io-client'
import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'

const socketUrl = 'http://192.168.100.25:5000'

class Layout extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      socket: null
    };
  }

  componentWillMount() {
    this.initSocket()
  }

  /*
  * Connect to and initialize the socket.
  */
  initSocket = () => {
    const socket = io(socketUrl)
    this.setState({socket})
  }

  setUsername = username => {
    this.setState({username})
  }

  render() {
    const { socket, username  } = this.state
    return (
      <div className="mjl-container">
        {
          !username ?
          <LoginForm
            setUsername = {this.setUsername}
            socket={socket}/>
          :
          <ChatContainer
            username = {username}
            socket={socket}/>
        }
      </div>
    );
  }

}

export default Layout;
