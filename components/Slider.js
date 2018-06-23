import __set from 'lodash/fp/set';
import _throttle from 'lodash/throttle'
import _isFunction from 'lodash/isFunction';
import React, { Component, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import PregressLine from '../ProgressLine';
import {
    createEventListener,
    convertToPercent,
    converPercentToPixels
} from '../utils';
import Marker from './Marker';

const Wrapper = styled.div `
    position: relative;
    width: 100%;
    height: 24px;
`;

class Slider extends Component {
    static propTypes = {
        algorithms: PropTypes.objectOf(PropTypes.func),
        markers: PropTypes.array.isRequired,
        min: PropTypes.number,
        max: PropTypes.number,
        transducers: PropTypes.array,
        onChange: PropTypes.func,
        values: PropTypes.array
    }
    static defaultProps = {
        min: 0,
        max: 100,
        transducers: [],
        algorithms: {
            calcValue: (state, props, value) => (
                convertToPercent(state.cords.width, value, props.max)
            ),
            calcPosition: (state, props, value) => (
                converPercentToPixels(value, state.cords.width, props.max)
            ),
            calcProgress: (state, props) => ({ left: state.values[0], right: state.values[1] })
        },
        onChange: Function.prototype,
        values: []
    }

    constructor(...props) {
        super(...props);
        this.state = {
            range: 100,
            step: 1,
            userStartPosition: [],
            values: this.props.values
        };

        this.sliderRef = createRef();
    }

    componentDidMount() {
        this.setState(state => ({ ...state, cords: this.getCords() }));

        this.unsubscribe = createEventListener(window, 'resize', _throttle(() => {
            this.setState(state => ({ ...state, cords: this.getCords() }));
        }, 100));
    }

    componentWillUnmount() {
        if (_isFunction(this.unsubscribe)) {
            this.unsubscribe();
        }
    }

    onBeforeChange = index => (value) => {
        this.setState(state => __set(
            `userStartPosition[${index}]`,
            (Array.isArray(state.userStartPosition) && state.userStartPosition[index]
                ? state.userStartPosition[index] : value)
        )(state));
    }

    onChange = index => (value) => {
        const { algorithms: { calcValue }, transducers } = this.props;
        const currentTransducer = _isFunction(transducers[index])
            ? transducers[index] : (...args) => args.pop();
        this.setState(state => __set(
            `values[${index}]`,
            currentTransducer(state, this.props, calcValue(state, this.props, value))
        )(state));
        this.props.onChange(this.state.values);
    };

    onAfterChange = index => () => {
        const { values } = this.props;
        this.setState(state => __set(
            `userStartPosition[${index}]`,
            state.userStartPosition[index] + values[index]
        )(state));
    }

    getCords = () => findDOMNode(this.sliderRef.current).getBoundingClientRect();

    render() {
        const { cords } = this.state;

        if (typeof cords === 'undefined' || !('width' in cords)) {
            return <Wrapper ref={this.sliderRef} />;
        }

        const { values } = this.state;
        const { markers, algorithms: { calcPosition, calcProgress } } = this.props;
        const { left, right } = calcProgress(this.state, this.props);

        return (
            <Wrapper ref={this.sliderRef}>
                {Array.isArray(markers) && markers.map((options) => {
                    const { renderCustomMarker, width = 24, id } = options;
                    const value = values[id];
                    const position = calcPosition(this.state, this.props, value);

                    return (
                        <Marker
                            key={`marker${id}`}
                            fvalue={position - (width / 2)}
                            width={width}
                            onBeforeChange={this.onBeforeChange(id)}
                            onChange={this.onChange(id)}
                            onAfterChange={this.onAfterChange(id)}
                        >
                            {_isFunction(renderCustomMarker)
                                && renderCustomMarker({ value, fvalue: position, id })
                            }
                        </Marker>
                    );
                })}
                <PregressLine left={left} right={right} />
            </Wrapper>
        );
    }
}

export default Slider;
