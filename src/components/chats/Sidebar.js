import React, { Component } from 'react';

class SideBar extends Component {

  render() {
    const {users} = this.props
    return (
      <div>
        <h3>People</h3>
        <ul className="user-list neutralize">
          {
            users.map((user, index) => {
              return <li key={index}>{user}</li>
            })
          }
        </ul>
      </div>
    );
  }

}

export default SideBar;
