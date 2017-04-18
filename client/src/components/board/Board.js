import React, { Component } from 'react';
import { Layer, Rect, Group } from 'react-konva';
import { connect } from 'react-redux';

import * as actions from 'actions/indexActions';
import store from 'reduxFiles/store';
import Modules from 'components/modules/Modules';
import ModulesItem from 'components/modules/ModulesItem';
import Anchor from './BoardAnchor';

class Board extends Component {
  
  componentDidMount() {
  /*  console.log(this.props)
    const stage = new Konva.Stage({
      width: this.props.width + 20,
      height: this.props.height + 20
    });
    
    const boardLayer = this.refs.boardLayer;
    console.log(boardLayer)
    stage.add(boardLayer);
    console.log(stage)
    const url = boardLayer.toDataURL();
    this.props.updateState(url);*/
  }
  // improves performance
  reRender() {
    const layer = this.refs.boardGroup.getLayer();
    layer.draw();
  }
  
  updatePosition() {
    const boardGroup = this.refs.boardGroup;
    const x = boardGroup.getX();
    const y = boardGroup.getY();
  
    store.dispatch(actions.updateBoardPosition({
      x: x, 
      y: y
    }))
  }
  
  handleDragEnd() {
    this.updatePosition();
  }
  
  render() {
    const {
      x,
      y,
      width,
      height,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight
     } 
     = this.props;
     
    return (
      <Layer ref="boardLayer">
        <Group
          ref="boardGroup"
          x={x}
          y={y}
          width={width}
          height={height}
          draggable="true" 
        
          onDragMove={this.reRender.bind(this)}
          onDragEnd={this.handleDragEnd.bind(this)}
          >
      
          <Rect
            ref="board"
            name={"board"}
            x={topLeft.x}
            y={topLeft.y}
            width={topRight.x - topLeft.x || width}
            height={bottomLeft.y - topLeft.y || height }
            fill="#e3e3e5"
            opacity="0.5"
            stroke="#ccc"
          />
            
          <Anchor x={topLeft.x} y={topLeft.y} name={"topLeft"} />
          <Anchor x={topRight.x || width} y={topRight.y} name={"topRight"} />
          <Anchor x={bottomLeft.x} y={bottomLeft.y || height} name={"bottomLeft"} />
          <Anchor x={bottomRight.x || width} y={bottomRight.y ||height} name={"bottomRight"} />
          
          <Modules />
        </Group>
      </Layer>
      );
  }
}

const mapStateToProps = (state) => ({
  width: state.boardSpecs.width,
  height: state.boardSpecs.height,
  x: state.boardSpecs.x,
  y: state.boardSpecs.y,
  topLeft: state.anchorPositions.topLeft,
  topRight: state.anchorPositions.topRight,
  bottomLeft: state.anchorPositions.bottomLeft,
  bottomRight: state.anchorPositions.bottomRight
});

export default connect(mapStateToProps)(Board);