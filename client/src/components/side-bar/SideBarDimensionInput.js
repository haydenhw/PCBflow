import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/indexActions';
import store from 'reduxFiles/store';
import './side-bar-styles/SideBarDimensionInput.css';

class SideBarDimensionInput extends React.Component {
  validate(value) {
    if (isNaN(value)) {
      return '';
    }
    
    if (Number(value) > 1000) {
      return 1000;
    }
    
    return Number(value); 
  }
  
  handleWidthChange(event) {
    const targetValue = event.target.value;
    const newBoardWidth = this.validate(targetValue);
    
    const {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      boardWidth
     }
     = this.props;

    const boardDimensions = {
      width: newBoardWidth,
      height: this.props.boardHeight,
    };

    const anchorPositions = {
      topLeft: { x: topLeft.x, y: topLeft.y },
      topRight: { x: topLeft.x + boardDimensions.width, y: topRight.y },
      bottomLeft: { x: bottomLeft.x, y: topLeft.y + boardDimensions.height },
      bottomRight: { x: bottomLeft.x + boardDimensions.width, y: topRight.y + boardDimensions.height },
    };

    store.dispatch(actions.updateBoardDimensions(boardDimensions));
    store.dispatch(actions.updateAnchorPositions(anchorPositions));
  }

  handleHeightChange(event) {
    const targetValue = event.target.value;
    const newBoardHeight = this.validate(targetValue);
    const {
      width,
      height,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
     }
     = this.props;

    const boardDimensions = {
      width: this.props.boardWidth,
      height: newBoardHeight
    };

    const anchorPositions = {
      topLeft: { x: topLeft.x, y: topLeft.y },
      topRight: { x: topLeft.x + boardDimensions.width, y: topRight.y },
      bottomLeft: { x: bottomLeft.x, y: topLeft.y + boardDimensions.height },
      bottomRight: { x: bottomLeft.x + boardDimensions.width, y: topRight.y + boardDimensions.height },
    };

    store.dispatch(actions.updateBoardDimensions(boardDimensions));
    store.dispatch(actions.updateAnchorPositions(anchorPositions));
  }

  render() {
    const { boardWidth, boardHeight } = this.props;
    return (
      <form>
        <div className="dimension-bar">Dimensions</div>
        <div className="dimension-input-wrapper">
          <div className="input-wrapper">
            <input
              type="text"
              className="width-input dimension-input"
              value={boardWidth === 0 ? '' : boardWidth}
              onChange={this.handleWidthChange.bind(this)}
            />
            <label>Width</label>
          </div>
          <div className="input-wrapper">
            <input
              className="height-input dimension-input"
              type="text"
              value={boardHeight === 0 ? '' : boardHeight}
              onChange={this.handleHeightChange.bind(this)}
            />
            <label>Height</label>
          </div>
        </div>
      </form>

    );
  }
}

const mapStateToProps = (state, props) => ({
  boardWidth: state.boardSpecs.width,
  boardHeight: state.boardSpecs.height,
  topLeft: state.anchorPositions.topLeft,
  topRight: state.anchorPositions.topRight,
  bottomLeft: state.anchorPositions.bottomLeft,
  bottomRight: state.anchorPositions.bottomRight,
});

export default connect(mapStateToProps)(SideBarDimensionInput);
