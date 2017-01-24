# react-modal

Accessible modal dialog component for React.JS

## Usage

```xml
<Modal
  isOpen={bool}
  onAfterOpen={afterOpenFn}
  onRequestClose={requestOpenFn}
  closeTimeoutMS={n}
  style={customStyle}
>
  <h1>Modal Content</h1>
  <p>Etc.</p>
</Modal>
```

## Styles
Styles are passed as an object with 2 keys, 'overlay' and 'content' like so
```js
{
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(255, 255, 255, 0.75)'
  },
  content : {
    position                   : 'absolute',
    top                        : '40px',
    left                       : '40px',
    right                      : '40px',
    bottom                     : '40px',
    border                     : '1px solid #ccc',
    background                 : '#fff',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'

  }
}
```

Styles passed to the modal are merged in with the above defaults and applied to their respective elements.
At this time, media queries will need to be handled by the consumer.

### Using CSS Classes

If you prefer not to use inline styles or are unable to do so in your project,
you can pass `className` and `overlayClassName` props to the Modal.  If you do
this then none of the default styles will apply and you will have full control
over styling via CSS.


### Overriding styles globally
The default styles above are available on `Modal.defaultStyles`. Changes to this
object will apply to all instances of the modal.

## Examples
Inside an app:

```js
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');

var appElement = document.getElementById('your-app-element');

/*
By default the modal is anchored to document.body. All of the following overrides are available.

* element
Modal.setAppElement(appElement);

* query selector - uses the first element found if you pass in a class.
Modal.setAppElement('#your-app-element');

*/

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


var App = React.createClass({

  getInitialState: function() {
    return { modalIsOpen: false };
  },

  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  afterOpenModal: function() {
    // references are now sync'd and can be accessed.
    this.refs.subtitle.style.color = '#f00';
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles} >

          <h2 ref="subtitle">Hello</h2>
          <button onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
      </div>
    );
  }
});

ReactDOM.render(<App/>, appElement);
```
# Testing

When using React Test Utils with this library, here are some things to keep in mind:
- You need to set isOpen={true} on the modal component for it to render its children.
- You need to use the `.portal` property, as in `ReactDOM.findDOMNode(renderedModal.portal)` or `TestUtils.scryRenderedDOMComponentsWithClass(Modal.portal, 'my-modal-class')` to acquire a handle to the inner contents of your modal.

By default the modal is closed when clicking outside of it (the overlay area). If you want to prevent this behavior you can
pass the 'shouldCloseOnOverlayClick' prop with 'false' value.
```xml
<Modal
  isOpen={bool}
  onAfterOpen={afterOpenFn}
  onRequestClose={requestCloseFn}
  closeTimeoutMS={n}
  shouldCloseOnOverlayClick={false}
  style={customStyle}>

  <h1>Force Modal</h1>
  <p>Modal cannot be closed when clicking the overlay area</p>
  <button onClick={handleCloseFunc}>Close Modal...</button>
</Modal>
```

# Demos
* http://reactjs.github.io/react-modal/
* http://reactjs.github.io/react-modal/bootstrap
