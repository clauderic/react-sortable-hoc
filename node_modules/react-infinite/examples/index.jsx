var ListItem = React.createClass({
    getDefaultProps: function() {
        return {
            height: 50,
            lineHeight: "50px"
        }
    },
    render: function() {
        return <div className="infinite-list-item" style={
            {
                height: this.props.height,
                lineHeight: this.props.lineHeight
            }
        }>
            List Item {this.props.index}
        </div>;
    }
});

var InfiniteList = React.createClass({
    getInitialState: function() {
        return {
            elements: this.buildElements(0, 50),
            isInfiniteLoading: false
        }
    },

    buildElements: function(start, end) {
        var elements = [];
        for (var i = start; i < end; i++) {
            elements.push(<ListItem key={i} index={i}/>)
        }
        return elements;
    },

    handleInfiniteLoad: function() {
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        setTimeout(function() {
            var elemLength = that.state.elements.length,
                newElements = that.buildElements(elemLength, elemLength + 100);
            that.setState({
                isInfiniteLoading: false,
                elements: that.state.elements.concat(newElements)
            });
        }, 2500);
    },

    elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading...
        </div>;
    },

    render: function() {
        return <Infinite elementHeight={50}
                         containerHeight={250}
                         infiniteLoadBeginEdgeOffset={200}
                         onInfiniteLoad={this.handleInfiniteLoad}
                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
                         isInfiniteLoading={this.state.isInfiniteLoading}
                         timeScrollStateLastsForAfterUserScrolls={1000}
                         >
                    {this.state.elements}
                </Infinite>;
    }
});

var AdditionInfiniteList = React.createClass({
    componentDidMount: function() {
        setTimeout(this.handleInfiniteLoad, 3000);
    },
    getInitialState: function() {
        return {
            elements: this.buildElements(0, 2),
            isInfiniteLoading: false
        }
    },

    buildElements: function(start, end) {
        var elements = [];
        for (var i = start; i < end; i++) {
            elements.push(<ListItem key={i} index={i}/>)
        }
        return elements;
    },

    handleInfiniteLoad: function() {
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        setTimeout(function() {
            var elemLength = that.state.elements.length,
                newElements = that.buildElements(elemLength, elemLength + 100);
            that.setState({
                isInfiniteLoading: false,
                elements: that.state.elements.concat(newElements)
            });
        }, 2500);
    },

    elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading...
        </div>;
    },

    render: function() {
        return <Infinite elementHeight={50}
                         containerHeight={250}
                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
                         isInfiniteLoading={this.state.isInfiniteLoading}
                         timeScrollStateLastsForAfterUserScrolls={1000}
                         >
                    {this.state.elements}
                </Infinite>;
    }
});

var VariableInfiniteList = React.createClass({
    getInitialState: function() {
        return {
            elementHeights: this.generateVariableElementHeights(100),
            isInfiniteLoading: false
        };
    },
    generateVariableElementHeights: function(number, minimum, maximum) {
        minimum = minimum || 40;
        maximum = maximum || 100;
        var heights = [];
        for (var i = 0; i < number; i++) {
            heights.push(minimum + Math.floor(Math.random() * (maximum - minimum)));
        }
        return heights;
    },
    handleInfiniteLoad: function() {
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        setTimeout(function() {
            var newElements = that.generateVariableElementHeights(100);
            that.setState({
                isInfiniteLoading: false,
                elementHeights: that.state.elementHeights.concat(newElements)
            });
        }, 2500);
    },
    elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading...
        </div>;
    },
    render: function() {
        var elements = this.state.elementHeights.map(function(el, i) {
            return <ListItem key={i} index={i} height={el} lineHeight={el.toString() + "px"}/>;
        });
        return <Infinite elementHeight={this.state.elementHeights}
                         containerHeight={250}
                         infiniteLoadBeginEdgeOffset={200}
                         onInfiniteLoad={this.handleInfiniteLoad}
                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
                         isInfiniteLoading={this.state.isInfiniteLoading}
                         timeScrollStateLastsForAfterUserScrolls={1000}
                         >
                    {elements}
                </Infinite>;
    }
});



ReactDOM.render(<InfiniteList/>,
        document.getElementById('infinite-example-one'));
ReactDOM.render(<VariableInfiniteList/>,
        document.getElementById('infinite-example-two'));
ReactDOM.render(<AdditionInfiniteList/>,
        document.getElementById('infinite-example-three'));
