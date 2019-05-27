import React, { Component } from 'react';

const colors = ['#E91E63','#FFB300', '#00BCD4', '#8BC34A', '#9C27B0', '#795548']



class SideBar extends Component {
  _renderUser(user, index){
    /*
    input   0 1 2 3 4 5 6 7 8 9 10 11 12
    output  0 1 2 3 4 5 0 1 2 3  4  5  0
    */
    const i = function(index){
      if(index >= colors.length){
        return index - colors.length*(index/colors.length)
      }
      return index
    }
    return (
      <div className="d-flex">
        <div className="u-pp" style={{background:colors[i(index)]}}>
          {user.charAt(0)}
        </div>
        <span style={{lineHeight:40+'px',fontSize: 13+'px'}}>{user}</span>
      </div>
    )
  }
  render() {
    const {users, myUsername} = this.props
    return (
      <div>
        <h2>People</h2>
        <ul className="user-list neutralize">
          {
            users.map((user, index) => (
              user === myUsername ? (
                <li key={index} style={{background:'#00cfb6', color: '#FFF'}}>
                  {this._renderUser(user, index)}
                </li>
              ):
              (
                <li key={index}>
                  {this._renderUser(user, index)}
                </li>
              )
            ))
          }
        </ul>
      </div>
    );
  }

}

export default SideBar;
