import React from 'react';

const mainStyle = {
  padding: 10,
  fontFamily: 'arial'
};

export default class Preview extends React.Component {
  constructor(globalState) {
    super();
    this.state = {};
    this.globalState = globalState;

    this.globalState.on('change', (kind, story) => {
      if (this.mounted) {
        this.setState({
          kind,
          story,
        })
      } else {
        this.state = {
          ...this.state,
          kind,
          story,
        };
      }
    });
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fireAction() {
    const { kind, story } = this.state;
    const message = `This is an action from ${kind}:${story}`;
    this.globalState.emit('action', message);
  }

  jump() {
    const { kind, story } = this.state;
    this.globalState.emit('jump', 'Component 2', 'State b');
  }

  toggleFullscreen() {
    this.globalState.emit('toggleFullscreen');
  }

  render() {
    const { kind, story } = this.state;
    return (
      <div style={mainStyle}>
        <h3>Rendering the Preview</h3>
        {kind} => {story}
        <ul>
          <li>
            <button onClick={this.fireAction.bind(this)}>Fire an Action</button>
          </li>
          <li>
            <button onClick={this.jump.bind(this)}>Jump to Component2:State b</button>
          </li>
          <li>
            <button onClick={this.toggleFullscreen.bind(this)}>Go FullScreen</button>
          </li>
        </ul>
      </div>
    );
  }
}
