import React, { Component } from 'react'
import io from 'socket.io-client'
import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'
import config from '../config';
import { VERIFY_USER, ADD_USER } from '../events';
const socketUrl = config.SERVER_URL

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
    socket.on('connect', ()=>{
      if(this.state.username){
        socket.emit(VERIFY_USER, this.state.username, this.reconnet);
      }
    })
    this.setState({socket})
  }

  /*
  * To reconnect user if connection is lost
  */
  reconnet = ({username, isUser}) => {
    const {socket} = this.state;
    if(isUser){
      this.setState({username: ''})
    }else{
      socket.emit(ADD_USER, username);
    }
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
