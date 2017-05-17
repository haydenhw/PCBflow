import React, { Component } from 'react';

import SideBarIconList from './SideBarIconList';
import SideBarIcon from './SideBarIcon';
import DimensionForm from './SideBarDimensionInput';
import SideBarDependencyMessage from './SideBarDependencyMessage';

import './side-bar-styles/SideBar.css';

export default class SideBar extends Component {
  renderDependencyMessage() {
    const { showAll, updateClientPosition } = this.props;
    const { mode, moduleName, dependencies } = this.props.iconVisibityData;
    
    if ((mode === 'DEPENDENCY') && (dependencies.length > 0)) {
      console.log(mode, dependencies.length)
      return (
        <SideBarDependencyMessage 
          moduleName={moduleName}
          showAll={showAll} 
        />
      );
    }
    return null;
  }
  componentDidMount() {
    this.depencyMessage = this.renderDependencyMessage();
  }
  
  render() {
    const { showAll, updateClientPosition } = this.props;
    const { mode, moduleName, dependencies } = this.props.iconVisibityData;
    
    const style = {
      height: '100% !important',
      width: '200px',
      position: 'fixed',
      zIndex: '1',
      left: '0px',
      verticalAlign: 'top',
    };
    
    return (
      <div className="sideBar" style={style}>
        {this.depencyMessage}
        <div className="module-container">
          <SideBarIconList
            toggleDraggingToBoard={this.props.toggleDraggingToBoard}
            toggleIsClicked={this.props.toggleIsClicked}
            onBoardModulesLength={this.props.onBoardModulesLength}
            updateClientPosition={updateClientPosition}
          />
        </div>
        <DimensionForm />
      </div>
    );
  }
}
