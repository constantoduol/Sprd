import React from 'react';

export default class Footer extends React.Component {
  render(){
    return (
      <div style={styles.footer}>Footer</div>
    )
  }
}

const styles = {
  footer: {
    background: "#E0E0E0",
    padding: 5,
    fontSize: 14,
    borderLeft: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD"
  }
}