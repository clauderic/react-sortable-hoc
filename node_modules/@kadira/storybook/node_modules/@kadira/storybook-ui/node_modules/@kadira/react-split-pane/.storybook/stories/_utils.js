import React, { PropTypes } from 'react';

export function nomargin(storyFn) {
  const style = {
    position: 'absolute',
    overflow: 'auto',
    top: 0, right: 0, bottom: 0, left: 0,
  };
  return <div style={style}>{storyFn()}</div>;
}

export function content(key) {
  return (
    <div key={key} style={{overflow: 'hidden', width: '100%', height: '100%'}}>
      <p style={{margin: 10}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  );
}

export const HSplit = React.createClass({
  render() {
    const style = {
      cursor: 'row-resize',
      background: '#EEEEEE',
      borderBottom: 'solid #E0E0E0 1px',
      borderTop: 'solid #E0E0E0 1px',
      width: '100%',
    };

    const headerStyle = {
      color: '#888',
      float: 'left',
      fontFamily: 'sans-serif',
      fontSize: '11px',
      letterSpacing: '1px',
      lineHeight: 1,
      margin: 0,
      padding: '8px 10px 8px 10px',
      textTransform: 'uppercase',
    };

    const buttonStyle = {
      background: 'transparent',
      border: 'none',
      color: '#888',
      float: 'right',
      fontFamily: 'sans-serif',
      fontSize: '11px',
      lineHeight: 1,
      outline: 'none',
      padding: '8px 15px 8px 10px',
    };

    const clearFix = {
      clear: 'both',
    };

    return (
      <div style={style}>
        <h3 style={headerStyle}>{this.props.header}</h3>
        <button style={buttonStyle} onClick={this.props.onClose}>✕</button>
        <div style={clearFix}></div>
      </div>
    );
  }
});

HSplit.propTypes = {
  header: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
