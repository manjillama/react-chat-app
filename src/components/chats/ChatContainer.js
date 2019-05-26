import React, { Component } from 'react'
import Messages from './Messages'
import Sidebar from './Sidebar'

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      message: '',
      typing: false,
      chats: [],
      users:[]
    };
  }

  componentWillMount(){
    const {socket} = this.props
    // socket.emit('add user', 'manjil');

    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
      this.setState({users: data.users})
      console.log(data);
    });

     // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', (data) => {
      this.setState({users: data.users})
      console.log(data);
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', (data) => {
      this.addChatMessage(data);
    });


    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', (data) => {
      this.addChatTyping(data);
    });

    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', (data) => {
      this.removeChatTyping(data);
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', (data) => {
      this.setState({users: data.users})
      console.log(data.username + ' left');
      this.removeChatTyping(data);
    });



   this.setState({socket})
  }

  addChatMessage = ({username, message}) => {
    const chat = {username, message}
    this.setState({chats: this.state.chats.concat(chat)})
    console.log(username, message);
  }

  addChatTyping = (data) => {
    console.log("Typing", data);
  }

  removeChatTyping = (data) => {
    console.log("Stop Typing", data);
  }

  // Sends a chat message
  handleSubmit = e => {
    e.preventDefault();
    const {message} = this.state
    const {username} = this.props
    // if there is a non-empty message and a socket connection
    if (message) {
      this.addChatMessage({
        username: username,
        message: message
      });

      // tell server to execute 'new message' and send along one parameter
      this.state.socket.emit('new message', message);
    }
    this.setState({message: ''})

  }

  onChange = e => {
    const {connected} = this.props
    if(connected){
      if(!this.state.typing){
        this.setState({typing: true})
        this.state.socket.emit('typing');
      }
    }

    if(this.stopTyping)
      clearInterval(this.stopTyping)

    this.stopTyping = setTimeout(() => {
      if (this.state.typing) {
        this.state.socket.emit('stop typing');
        this.setState({typing: false})
      }
    }, 400);

    this.setState({message: e.target.value})
  }


  render() {
    const {message, users} = this.state
    const {username} = this.props
    return (
      <section className="d-flex">
        <div id="sidebar">
          <Sidebar users={users}/>
        </div>
        <div style={{width:15+'px'}}>
        </div>
        <div id="chatbox">
          <Messages chats={this.state.chats} myUsername={username}/>
          <form className="d-flex" onSubmit={this.handleSubmit}>
            <input
              value= {message}
              onChange={this.onChange} placeholder="Type here..."/>
            <button>Send</button>
          </form>
        </div>
      </section>
    );
  }

}

export default ChatContainer;
