import React, { Component } from 'react'
import io from 'socket.io-client'
import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'

const socketUrl = 'http://localhost:5000'

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
    socket.on('connect', () => {
      console.log('Connected...');
    })
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
            username = {username}
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
