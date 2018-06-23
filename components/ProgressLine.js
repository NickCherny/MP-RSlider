import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ProgressStateLine = styled.div.attrs({
    style: ({ left, right }) => ({ left, right })
}) `
    display: block;
    position: absolute;
    bottom: 0;
    top: 0;
    margin: auto;
    height: 2px;
    background-color: #4a90e2;
    z-index: 2;
    transition: all ease 30ms;
`;

const LineWrapper = styled.div `
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 100%;
    &:after {
        content: "";
        height: 2px;
        width: 100%;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        background: #e9eff4;
    }
`;

const ProgressLine = ({
    left,
    right
}) => (
    <LineWrapper>
        <ProgressStateLine left={left} right={right} />
    </LineWrapper>
);

ProgressLine.propTypes = {
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired
};

export default ProgressLine;
