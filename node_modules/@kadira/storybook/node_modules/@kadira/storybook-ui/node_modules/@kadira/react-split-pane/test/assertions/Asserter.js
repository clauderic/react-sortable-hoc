import React from 'react';
import ReactDOM from 'react-dom';
import SplitPane from '../../lib/SplitPane';
import Resizer from '../../lib/Resizer';
import Pane from '../../lib/Pane';
import chai from 'chai';
import spies from 'chai-spies';
const expect = chai.expect;
import VendorPrefix from 'react-vendor-prefix';
import ReactTestUtils from 'react-addons-test-utils';

chai.use(spies);

/**
 * getBoundingClientRect() does not work correctly with ReactTestUtils.renderIntoDocument().
 * So for testing resizing we need  ReactDOM.render()
 */
const render = (jsx, renderToDOM) => {
    if (renderToDOM) {
        const testDiv = document.createElement('div');
        document.body.appendChild(testDiv);
        return ReactDOM.render(jsx, testDiv);
    } else {
        return ReactTestUtils.renderIntoDocument(jsx);
    }
};


export default (jsx, renderToDom = false) => {
    const splitPane = render(jsx, renderToDom);
    const component = ReactTestUtils.findRenderedComponentWithType(splitPane, SplitPane);


    const findPanes = () => {
        return ReactTestUtils.scryRenderedComponentsWithType(component, Pane);
    };


    const findTopPane = () => {
        return findPanes()[0];
    };

    const findBottomPane = () => {
        return findPanes()[1];
    };

    const findPaneByOrder = (paneString) => {
        return paneString === 'first' ? findTopPane() : findBottomPane();
    };

    const findResizer = () => {
        return ReactTestUtils.scryRenderedComponentsWithType(splitPane, Resizer);
    };


    const assertStyles = (componentName, actualStyles, expectedStyles) => {
        const prefixed = VendorPrefix.prefix({styles: expectedStyles}).styles;
        for (let prop in prefixed) {
            if (prefixed.hasOwnProperty(prop)) {
                //console.log(prop + ': \'' + actualStyles[prop] + '\',');
                if (prefixed[prop] && prefixed[prop] !== '') {
                    //console.log(prop + ': \'' + actualStyles[prop] + '\',');
                    expect(actualStyles[prop]).to.equal(prefixed[prop], `${componentName} has incorrect css property for '${prop}'`);
                }
                //expect(actualStyles[prop]).to.equal(prefixed[prop], `${componentName} has incorrect css property for '${prop}'`);
            }
        }
        return this;
    };


    const assertPaneStyles = (expectedStyles, paneString) => {
        const pane = findPaneByOrder(paneString);
        return assertStyles(`${paneString} Pane`, ReactDOM.findDOMNode(pane).style, expectedStyles);
    };


    const assertCallbacks = (expectedDragStartedCallback, expectedDragFinishedCallback) => {
        expect(expectedDragStartedCallback).to.have.been.called();
        expect(expectedDragFinishedCallback).to.have.been.called();
    };


    const getResizerPosition = () => {
        const resizerNode = ReactDOM.findDOMNode(findResizer()[0]);
        return resizerNode.getBoundingClientRect();
    };


    const calculateMouseMove = (mousePositionDifference) => {
        const resizerPosition = getResizerPosition();
        let mouseMove =  {
            start: {
                clientX: resizerPosition.left,
                clientY: resizerPosition.top
            },
            end: {
                clientX: resizerPosition.left,
                clientY: resizerPosition.top
            }
        };

        if (mousePositionDifference.x) {
            mouseMove.end.clientX = resizerPosition.left + mousePositionDifference.x;
        } else if (mousePositionDifference.y) {
            mouseMove.end.clientY = resizerPosition.top + mousePositionDifference.y;
        }

        return mouseMove;
    };

    const simulateDragAndDrop = (mousePositionDifference) => {
        const mouseMove = calculateMouseMove(mousePositionDifference);
        component.onMouseDown(mouseMove.start);
        component.onMouseMove(mouseMove.end);
        component.onMouseUp();
    };

    const assertClass = (component, expectedClassName) => {
        expect(ReactDOM.findDOMNode(component).className).to.contain(expectedClassName, `Incorrect className`);
        return this;
    };

    return {
        assertOrientation(expectedOrientation) {
            expect(ReactDOM.findDOMNode(component).className).to.contain(expectedOrientation, `Incorrect orientation`);
            return this;
        },

        assertSplitPaneClass(expectedClassName) {
          assertClass(component, expectedClassName);
        },


        assertPaneClasses(expectedTopPaneClass, expectedBottomPaneClass) {
            assertClass(findTopPane(), expectedTopPaneClass);
            assertClass(findBottomPane(), expectedBottomPaneClass);
        },


        assertPaneContents(expectedContents) {
            const panes = findPanes();
            let values = panes.map((pane) => {
                return ReactDOM.findDOMNode(pane).textContent;
            });
            expect(values).to.eql(expectedContents, `Incorrect contents for Pane`);
            return this;
        },


        assertContainsResizer(){
            expect(findResizer().length).to.equal(1, `Expected the SplitPane to have a single Resizer`);
            expect(findPanes().length).to.equal(2, `Expected the SplitPane to have 2 panes`);
            return this;
        },


        assertPaneWidth(expectedWidth, pane = 'first') {
            return assertPaneStyles({width: expectedWidth}, pane);
        },


        assertPaneHeight(expectedHeight, pane = 'first') {
            return assertPaneStyles({height: expectedHeight}, pane);
        },


        assertResizeByDragging(mousePositionDifference, expectedStyle) {
            simulateDragAndDrop(mousePositionDifference);
            return assertPaneStyles(expectedStyle, component.props.primary);
        },

        assertResizeCallbacks(expectedDragStartedCallback, expectedDragFinishedCallback) {
            simulateDragAndDrop(200);
            return assertCallbacks(expectedDragStartedCallback, expectedDragFinishedCallback);
        }
    }
}

