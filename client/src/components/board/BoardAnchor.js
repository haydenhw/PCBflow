import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Circle } from 'react-konva';
import { connect } from 'react-redux';

import * as actions from 'actions/indexActions';
import store from 'reduxFiles/store';

export default class Anchor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strokeWidth: 2,
    };

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.moveToTop = this.moveToTop.bind(this);
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  componentDidMount() {
    this.anchor = this.refs.anchor;
  }

  componentDidUpdate(prevProps) {
    if (this.props.updateAnchorTrigger !== prevProps.updateAnchorTrigger) {
      const { x, y } = this.props;
      this.anchor.setX(x);
      this.anchor.setY(y);
    }
  }

  draggableOn() {
    const group = this.refs.anchor.getParent();
    group.setDraggable(true);
  }

  moveToTop() {
    const group = this.refs.anchor.getParent();
    const layer = group.getLayer();

    group.setDraggable(false);
    this.refs.anchor.moveToTop();
  }

  updatePosition(callback) {
    const activeAnchor = this.refs.anchor;
    const group = this.refs.anchor.getParent();
    const board = group.get('.board')[0];
    const layer = group.getLayer();
    const topLeft = group.get('.topLeft')[0];
    const topRight = group.get('.topRight')[0];
    const bottomRight = group.get('.bottomRight')[0];
    const bottomLeft = group.get('.bottomLeft')[0];
    const anchorX = activeAnchor.getX();
    const anchorY = activeAnchor.getY();
    // update anchor positions

    switch (activeAnchor.getName()) {
      case 'topLeft':
        topRight.setY(anchorY);
        bottomLeft.setX(anchorX);
        break;
      case 'topRight':
        topLeft.setY(anchorY);
        bottomRight.setX(anchorX);
        break;
      case 'bottomRight':
        bottomLeft.setY(anchorY);
        topRight.setX(anchorX);
        break;
      case 'bottomLeft':
        bottomRight.setY(anchorY);
        topLeft.setX(anchorX);
        break;
    }

    if (callback) {
      const anchorPositions = {
        topLeft: { x: topLeft.getX(), y: topLeft.getY() },
        topRight: { x: topRight.getX(), y: topRight.getY() },
        bottomLeft: { x: bottomLeft.getX(), y: bottomLeft.getY() },
        bottomRight: { x: bottomRight.getX(), y: bottomRight.getY() },
      };

      callback(anchorPositions);
    }

    board.position(topLeft.position());

    const width = topRight.getX() - topLeft.getX();
    const height = bottomLeft.getY() - topLeft.getY();

    if (width && height) {
      const boardDimensions = {
        width,
        height,
      };

      store.dispatch(actions.updateBoardDimensions(boardDimensions));
    }
  }

  handleMouseOver() {
    document.body.style.cursor = 'pointer';
    this.setState({
      strokeWidth: 4,
    });
  }

  handleDragMove() {
    this.updatePosition();
    this.props.hideFloatingElements();
  }

  handleDragEnd() {
    this.props.unhideFloatingElements();
    this.draggableOn();
    this.updatePosition(anchorPositions => store.dispatch(actions.updateAnchorPositions(anchorPositions)));
  }

  handleMouseOut() {
    document.body.style.cursor = 'default';
    this.setState({
      strokeWidth: 2,
    });
  }

  render() {
    const { x, y, name } = this.props;

    if(this.anchor) {
      // console.log(this.anchor.getX());
      // console.log(this.anchor.getY());
    }

    return (
      <Circle
        ref="anchor"
        x={this.anchor ? this.anchor.getX() : x}
        y={this.anchor ? this.anchor.getY() : y}
        stroke="#666"
        fill="#ddd"
        strokeWidth={this.state.strokeWidth}
        radius="8"
        name={name}
        draggable="true"
        dragOnTop="false"
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onMouseDown={this.moveToTop}
        onDragMove={this.handleDragMove}
        onDragEnd={this.handleDragEnd}
      />);
  }
}

Anchor.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  name: PropTypes.string.isRequired,
  hideFloatingElements: PropTypes.func.isRequired,
  unhideFloatingElements: PropTypes.func.isRequired,
};
