import React, { Component } from 'react';
import { Layer, Rect, Stage, Group } from 'react-konva';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import * as actions from 'actions/indexActions';
import store from 'reduxFiles/store';
import Board from 'components/board/Board';
import ModuleContainer from 'components/modules/Modules';
import Grid from './DesignToolGrid';
import getPerimeterSide from 'helpers/getPerimeterSide';
import bindToPerimeter from 'helpers/bindToPerimeter';
import rotateAboutCenter from 'helpers/rotateAboutCenter';

  class DesignToolStage extends Component {
  deleteModule() {
    store.dispatch(actions.deleteSelectedModule(this.props.selectedModuleIndex));
  }
  
  rotate() {
    const {
      x,
      y, 
      index,
      innerGroupX,
      innerGroupY,
      rotation,
      width,
      height
    } = this.props.selectedModuleProps;
    const { topLeft } = this.props.anchorPositions;
    const { selectedModuleProps, anchorPositions, boardSpecs } = this.props;
    let { boundToSideIndex } = this.props.selectedModuleProps;
    let newParentGroupCoordinates;
    let newInnerGroupCoordinates;
    
    newParentGroupCoordinates = bindToPerimeter(selectedModuleProps, anchorPositions, boardSpecs);
    newInnerGroupCoordinates = (
    rotateAboutCenter(boundToSideIndex, rotation, innerGroupX, innerGroupY, width, height)
    );
    
    const rotationData = {
      index,
      boundToSideIndex: newInnerGroupCoordinates.boundToSideIndex, 
      rotation: newInnerGroupCoordinates.rotation,
      innerGroupX: newInnerGroupCoordinates.x,
      innerGroupY: newInnerGroupCoordinates.y,
      parentGroupX: newParentGroupCoordinates ? newParentGroupCoordinates.x : x,
      parentGroupY: newParentGroupCoordinates ? newParentGroupCoordinates.y : y
    }
     
  store.dispatch(actions.rotateSelectedModule(rotationData));
  }
    
  render() {
    const { 
      shouldRenderBoard, 
      draggingModule, 
      isMouseDownOnIcon,
      isMouseDown,
      isMouseOverModule
     } = this.props;
     
    const stageStyle = { 
      "display": "inline-block"
    }
    return (
      <div>
        <ContextMenuTrigger
          id={'SIMPLE'} 
          name={'rect'}
          disable={!(!isMouseDown && isMouseOverModule)}
          holdToDisplay={1000}
          >
            <div style={stageStyle}>
              <Stage 
                style={stageStyle} 
                ref="stage" 
                width={1500} 
                height={1000}
              >
                <Grid  gridWidth={5000}  cellWidth={20} />
                {shouldRenderBoard ? <Board /> : <Layer></Layer>}
                {isMouseDownOnIcon ? <Layer>{ draggingModule }</Layer> : <Layer></Layer> }
              </Stage>
            </div>
        </ContextMenuTrigger>
        
        <ContextMenu id={'SIMPLE'}>
            <MenuItem onClick={this.deleteModule.bind(this)}>delete</MenuItem>
            <MenuItem onClick={this.rotate.bind(this)}>rotate</MenuItem>
        </ContextMenu>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isMouseDownOnIcon: state.mouseEvents.mouseDownOnIcon,
  isMouseOverModule: state.mouseEvents.isMouseOverModule,
  isMouseDown: state.mouseEvents.isMouseDown,
  selectedModuleIndex: state.selectedModule.index,
  selectedModuleProps: state.selectedModule,
  boardSpecs: state.boardSpecs,
  anchorPositions: state.anchorPositions
});

export default connect(mapStateToProps)(DesignToolStage);
