import React, { Component } from 'react';

class Messages extends Component {
  constructor(props) {
    super(props);

    this.scrollDown = this.scrollDown.bind(this)
  }

  scrollDown(){
    const { messages } = this.refs
    messages.scrollTop = messages.scrollHeight
  }

  componentDidMount() {
    this.scrollDown()
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollDown()
  }

  render() {
    const {chats, myUsername} = this.props
    return (
      <ul ref="messages" className="messages neutralize">
        {
          chats.map((chat, index) => {
            const msgAlign = chat.username === myUsername ? 'right' : ''
            return (
              <li key={index} className={msgAlign}>
                <span className="m">{chat.message}</span>
                {chat.username !== myUsername && <span className="text-muted sender">{chat.username}</span>}
              </li>
            )
          })
        }
      </ul>
    );
  }

}

export default Messages;
