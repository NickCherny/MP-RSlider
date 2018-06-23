import _throttle from 'lodash/throttle';
import _get from 'lodash/get';
import styled from 'styled-components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createEventListener } from '../utils';

const MarkerStyled = styled.div.attrs({ style: ({ left }) => ({ left }) }) `
    position: absolute;
    cursor: pointer;
    height: ${({ width }) => width}px;
    width: ${({ width }) => width}px;
    border-radius: 15px;
    box-shadow: 0 3px 17px 0 rgba(205, 205, 205, 0.5);
    background-color: #ffffff;
    border: solid 0.7px #4a90e2;
    z-index: 3;
`;

class Marker extends Component {
    static propTypes = {
        fvalue: PropTypes.number.isRequired,
        width: PropTypes.number,
        children: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        onBeforeChange: PropTypes.func.isRequired,
        onAfterChange: PropTypes.func.isRequired
    }

    static defaultProps = {
        width: 24,
        children: null
    }

    onMouseDown = (event) => {
        const { onBeforeChange, onAfterChange, onChange } = this.props; /* eslint no-invalid-this: 0 */
        onBeforeChange(_get(event, 'nativeEvent.pageX'));
        const unsubscribe = createEventListener(document, 'mousemove', (e) => {
            const handler = _throttle(onChange, 20);
            handler(_get(e, 'pageX'));
        });
        const unsubscribeMouseup = createEventListener(document, 'mouseup', () => {
            unsubscribe();
            onAfterChange();
            unsubscribeMouseup();
        });
    }

    onTouchStart = (event) => {
        const { onBeforeChange, onAfterChange, onChange } = this.props;
        onBeforeChange(_get(event, 'nativeEvent.touches[0].pageX'));
        const unsubscribe = createEventListener(document, 'touchmove', (e) => {
            const handler = _throttle(onChange, 50);
            handler(_get(e, 'touches[0].pageX'));
        });
        const unsubscribeTouchend = createEventListener(document, 'touchend', (e) => {
            unsubscribe();
            onAfterChange(e);
            unsubscribeTouchend();
        });
    }

    render() {
        const { width, fvalue, children } = this.props;
        return (
            <MarkerStyled
                width={width}
                left={fvalue}
                onMouseDown={this.onMouseDown}
                onTouchStart={this.onTouchStart}
            >
                {children}
            </MarkerStyled>
        );
    }
}

export default Marker;
