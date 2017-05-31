nmimport React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, hashHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Joyride from 'react-joyride';

import * as actions from 'actions/indexActions';
import store from 'reduxFiles/store';
import checkCollision from 'helpers/checkCollision';
import getPerimeterSide from 'helpers/getPerimeterSide';
import getTimeStamp from 'helpers/getTimeStamp';
import rotate from 'helpers/rotate';

import Board from 'components/board/Board';
import Module from 'components/modules/ModulesItem';
import ModuleContainer from 'components/modules/Modules';
import BoardDimensionInput from 'components/board/BoardDimensionForm';
import TopNavbar from 'components/top-navbar/TopNavbar';
import SideBar from 'components/side-bar/SideBar';
import TopNavbarEditableText from 'components/top-navbar/TopNavbarEditableText';
import Footer from 'components/footer/Footer';
import Modal from 'components/modal/Modal';
import DesignToolStage from './DesignToolStage';
import DesignToolInfoButton from './DesignToolInfoButton';
import DocumentationCard from './DesignToolDocumentationCard';
import DesignToolBoardFrame from './DesignToolBoardFrame';
import DesignToolTodo from './DesignToolTodo';
import { tourSteps, dependecyDemo } from './DesignToolTourSteps';
import { tutorialSteps } from './DesignToolTutorialSteps';
import { toolTips } from 'config/toolTips'

import './design-tool-styles/DesignToolToggleInfoButton.css';
import './design-tool-styles/DesignToolDocumentationCard.css';
import './design-tool-styles/DesignToolOnboardModal.css'
import './design-tool-styles/joyride.css';


let DesignTool = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tutorialSteps,
      x: 0,
      y: 0,
      isSideBarHidden: false,
      isDraggingToBoard: false,
      shouldRender: false,
      shouldUpdateThumbnail: false,
      wasDocumentationOpen: false,  //should be true in production
      shouldRenderDocumentation: false, //should be true in production
      shouldRenderInfoButton: true,
      shouldRenderModal: true, 
      shouldHideContextMenu: false,
      image: null,
      joyrideStep: 0,
      tourSteps: tourSteps,
      disabledIconExceptions: null,
      running: false,
    };
    
    this.handleRightButtonClick = this.handleRightButtonClick.bind(this);
    this.handleJoyrideCallback = this.handleJoyrideCallback.bind(this);
    
    this.toggleDraggingToBoard = this.toggleDraggingToBoard.bind(this);
    this.toggleDocumentationCard = this.toggleDocumentationCard.bind(this);
    this.toggleShouldUpadateThumbnail = this.toggleShouldUpadateThumbnail.bind(this);
    
    this.bound_handleMouseDown = this.handleMouseDown.bind(this);
    this.bound_handleMouseUp = this.handleMouseUp.bind(this);
    this.bound_handleMouseMove = this.handleMouseMove.bind(this);
    this.bound_handleKeyUp = this.handleKeyUp.bind(this);
  }
  
  static defaultProps = {
    joyride: {
      autoStart: true,
      resizeDebounce: false,
      run: false,
    },
  };
  
  static keyPress(evt) {
    const evtobj = window.event ? event : evt;
    
    if (evtobj.keyCode === 90 && evtobj.ctrlKey) {
      store.dispatch(actions.undo());
    }
    
    if (evtobj.keyCode === 89 && evtobj.ctrlKey) {
      store.dispatch(actions.redo());
    }
  }
  
  static calculateNewModuleCoordinates(coordinateData) {
    const cd = coordinateData;
    
    const boundToSide = getPerimeterSide(cd.boundToSideIndex) || null;
    
    switch (boundToSide) {
      case 'top':
      return {
        x: cd.moduleX - cd.boardX - (cd.width / 2),
        y: 0,
      };
      case 'bottom':
      return {
        x: cd.moduleX - cd.boardX - (cd.width / 2),
        y: cd.boardHeight - cd.height,
      };
      default:
      return {
        x: cd.moduleX - cd.boardX - (cd.width / 2),
        y: cd.moduleY - cd.boardY - (cd.height / 2),
      };
    }
  }
  
  static handleNameChange(projectId, newName) {
    const nameObject = {
      name: newName.message,
    };
    
    store.dispatch(actions.updateProject(nameObject, projectId));
  }
  
  static updateLastSaved() {
    const lastSaved = getTimeStamp();
    store.dispatch(actions.updateLastSavedTime(lastSaved));
  }
  
  static recordSavedChanges() {
    store.dispatch(actions.toggleHasUnsavedChanges());
  }
  
  static routeToProjects() {
    hashHistory.push('/projects');
  }
  
  addHanlders() {
    document.body.addEventListener('mousedown', this.bound_handleMouseDown);
    document.body.addEventListener('mouseup', this.bound_handleMouseUp);
    document.body.addEventListener('mousemove', this.bound_handleMouseMove);
    document.body.addEventListener('keyup', this.bound_handleKeyUp);
    document.onkeydown = DesignTool.keyPress;
    
    window.onpopstate = this.toggleShouldUpadateThumbnail.bind(this);
    window.onbeforeunload = () => this.props.hasUnsavedChanges ? '' : null;
  }
  
  removeHanlders() {
    document.body.removeEventListener('mousedown', this.bound_handleMouseDown);
    document.body.removeEventListener('mouseup', this.bound_handleMouseUp);
    document.body.removeEventListener('mousemove', this.bound_handleMouseMove);
    document.body.removeEventListener('keyup', this.bound_handleKeyUp);
  }
  
  setRouteHook() {
    const { router, route, hasUnsavedChanges} = this.props;
    
    router.setRouteLeaveHook(route, () => {
      console.log(hasUnsavedChanges)
      if (/* true ||*/ hasUnsavedChanges) {
        return 'Changes you made will not be saved. Are you sure you want to leave?';
      }
      return null;
    });
  }
  
  componentWillMount() {
    const { shouldRenderModal } = this.props;
    
    if (!shouldRenderModal) {
     store.dispatch(actions.toggleShouldRenderModal());
    }
  }
  
  componentDidMount() {
    if (!this.props.currentProjectName) {
      const projectId = this.props.params.projectId;
      const currentRoute = this.props.location.pathname;
      
      store.dispatch(actions.fetchProjectById(projectId, currentRoute));
    }
    
    this.setRouteHook();
    this.addHanlders();
  }
  
  /*componentDidUpdate(prevProps) {
    if (prevProps.hasUnsavedChanges === false && this.props.hasUnsavedChanges === true) {
      window.onbeforeunload = () => true ? '' : null;
    }
    
    if (prevProps.hasUnsavedChanges === true && this.props.hasUnsavedChanges === false) {
      console.log('saved')
      window.onbeforeunload = () => false ? '' : null;
    }
  }
  */
  componentWillUnmount() {
    clearTimeout(this.timeOut);
    this.removeHanlders();
  }
  
  dropDraggingModule() {
    const { draggingModuleData, boardSpecs } = this.props;
    const { width, height, boundToSideIndex } = draggingModuleData;
    const { x, y, isDraggingToBoard } = this.state;
    
    const coordinateData = {
      width,
      height,
      boundToSideIndex,
      moduleX: x,
      moduleY: y,
      boardX: boardSpecs.x,
      boardY: boardSpecs.y,
      boardHeight: boardSpecs.height,
    };
    
    const testModuleCoordinates = {
      x: x - (width / 2),
      y: y - (height / 2),
    };
    
    const testModule = Object.assign(testModuleCoordinates, draggingModuleData);

    const isNewModuleWithinBounds = checkCollision([testModule, boardSpecs]).length > 0;

    const adjustedModuleCoordinates = DesignTool.calculateNewModuleCoordinates(coordinateData);

    const newModule = Object.assign(adjustedModuleCoordinates, draggingModuleData);
    
    if (isNewModuleWithinBounds && isDraggingToBoard) {
      store.dispatch(actions.pushToCurrentProjectModules(newModule));
    } else {
      store.dispatch(actions.toggleShouldRenderSideBar(true));
    }
    
    this.timeOut = setTimeout(() => store.dispatch(actions.mouseDownOnIcon(false)), 1);
    this.setState({ isDraggingToBoard: false });
  }
  
  handleKeyUp(evt) {
    const evtobj = window.event ? event : evt;
    const { isMouseOverModule, selectedModuleIndex } = this.props;
    
    if (isMouseOverModule && (evtobj.code === 'Delete')) {
      store.dispatch(actions.deleteSelectedModule(selectedModuleIndex));
    }
  }
  
  updateClientPosition(evt) {
    const stageOffsetX = Number(this.stageContainer.getBoundingClientRect().left);
    const stageOffsetY = Number(this.stageContainer.getBoundingClientRect().top);
    const x = Number(evt.clientX) - stageOffsetX;
    const y = Number(evt.clientY) - stageOffsetY;
    
    this.setState({
      x,
      y,
    });
  }
  
  handleMouseMove(evt) {
    if (this.state.isDraggingToBoard) {
      this.updateClientPosition(evt);
    }
  }
  
  handleMouseDown(evt) {
    if (evt.which === 1) {
      store.dispatch(actions.toggleIsMouseDown(true));
    }
  }
  
  handleClick(evt) {
    /*if ((evt.which === 1) && !this.props.isMouseOverModule) {
    store.dispatch(actions.updateIconVisibity('ALL'));
  }*/
  }

  handleMouseUp(evt) {
    if ((evt.which === 1) && !this.state.shouldHideContextMenu) {
      this.toggleShouldHideContextMenu(true);
    }
    
    if ((evt.which === 3) && this.props.isMouseOverModule) {
      this.toggleShouldHideContextMenu(false);
    }
    
    this.dropDraggingModule();
    store.dispatch(actions.toggleIsMouseDown(false));
  }
  
  handleRightButtonClick() {
    if (this.state.joyrideStep === 1) {
      this.joyride.next();
    }
  }

  toggleDraggingToBoard() {
    this.setState({ isDraggingToBoard: true });
    store.dispatch(actions.toggleShouldRenderSideBar(false));
  }
  
  toggleShouldHideContextMenu(boolean) {
    this.setState({
      shouldHideContextMenu: boolean,
    });
  }

  toggleShouldUpadateThumbnail() {
    this.setState({
      shouldUpdateThumbnail: !this.state.shouldUpdateThumbnail,
    });
  }

  updateState(url) {
    this.setState({ image: url });
  }

  showAllModuleIcons() {
    store.dispatch(actions.updateIconVisibity('ALL'));
  }

  toggleDocumentationCard() {
    const { shouldRenderDocumentation, wasDocumentationOpen } = this.state;
    this.setState({
      shouldRenderDocumentation: !shouldRenderDocumentation,
      wasDocumentationOpen: !wasDocumentationOpen,
      tooltipHook: null
    });
  }

  hideFloatingElements() {
    if (!this.props.isMouseOverModule) {
      store.dispatch(actions.updateShouldRenderTodoList(false))
      this.setState({
        shouldRenderDocumentation: false,
        shouldRenderInfoButton: false,
      });
    }
  }

  unhideFloatingElements() {
    const { wasDocumentationOpen } = this.state;
    const { isTutorialActive, tutorialStep } = this.props;
    
    if (isTutorialActive && tutorialStep === 13) {
      store.dispatch(actions.updateShouldRenderTodoList(true));
    }
    
    this.setState({
      shouldRenderDocumentation: wasDocumentationOpen,
      shouldRenderInfoButton: true,
    });
  }

  rotate() {
    const { selectedModuleProps, anchorPositions, boardSpecs } = this.props;
    const rotationData = rotate(selectedModuleProps, anchorPositions, boardSpecs);
    store.dispatch(actions.rotateSelectedModule(rotationData));
  }
  
  getDraggingModule() {
    const { draggingModuleData } = this.props;
    const { x,y } = this.state;
    
    return (
      <Module
        x={x - (draggingModuleData.width / 2)}
        y={y - (draggingModuleData.height / 2)}
        width={draggingModuleData.width}
        height={draggingModuleData.height}
        stroke={draggingModuleData.stroke}
        strokeWidth={draggingModuleData.strokeWidth}
        imageX={draggingModuleData.imageX}
        imageY={draggingModuleData.imageY}
        imageWidth={draggingModuleData.imageWidth}
        imageHeight={draggingModuleData.imageHeight}
        imageSrc={draggingModuleData.imageSrc}
        imageNode={draggingModuleData.imageNode}
        id={'100'}
      />
    );
  }
  
  startTour() {
    store.dispatch(actions.toggleShouldRenderModal());
    this.setState({
      running: true,
      joyrideStep: 0,
    });
  }
  
  restartTour() {
    store.dispatch(actions.toggleShouldRenderModal());
    this.joyride.reset(true);
  }
  
  handleJoyrideCallback(result) {
    const { joyride } = this.props;
    
    if (result.type === 'step:before') {
      // Keep internal state in sync with joyride
      this.setState({ step: result.index });
    }
    
    if (result.type === 'finished') {
      store.dispatch(actions.incrementTutorialStep());
      store.dispatch(actions.toggleShouldRenderModal());
      this.setState({
         running: false,
         joyrideStep: 0, 
         tourSteps: dependecyDemo 
       });
      
    }
    
    if (result.type === 'error:target_not_found') {
      this.setState({
        step: result.action === 'back' ? result.index - 1 : result.index + 1,
        autoStart: result.action !== 'close' && result.action !== 'esc',
      });
    }
    
    if (typeof joyride.callback === 'function') {
      joyride.callback();
    }
  }
  
  addTooltip(toolTipData) {
    this.joyride.addTooltip(toolTipData);
  }
  
  renderJoyride() {
    const { joyride } = this.props;
    
    const joyrideProps = {
      autoStart: true || joyride.autoStart || this.state.autoStart,
      callback: this.handleJoyrideCallback,
      debug: false,
      disableOverlay: true,
      resizeDebounce: joyride.resizeDebounce,
      run: this.state.running,
      scrollToFirstStep: joyride.scrollToFirstStep || true,
      stepIndex: 0,  //joyride.stepIndex || this.state.joyrideStep,
      steps: this.state.tourSteps,
      type: 'continuous',
      locale: {next: 'Next', last: 'Next', back: 'Back'}
    };
    
    return (
      <Joyride
        {...joyrideProps}
        ref={node => this.joyride = node} 
      />
    );
  }
  
  renderSideBar() {
    const { iconVisibityData, currentProjectModules, shouldRenderSideBar } = this.props;
    const { isDraggingToBoard, disabledIconExceptions } = this.state;
    
    if (shouldRenderSideBar) {
      return (
        <SideBar 
          toggleDraggingToBoard={this.toggleDraggingToBoard} 
          showAll={this.showAllModuleIcons}
          updateClientPosition={this.updateClientPosition.bind(this)}    
          iconVisibityData={iconVisibityData}
          onBoardModulesLength={currentProjectModules.length}
        />
      );
    }
    
    return null;
  }
  
  renderInfoButton() {
    const { shouldRenderDocumentation } = this.state;
    const infoButtonIconClass = shouldRenderDocumentation ? 'fa-close' : 'fa-question';
    
    const infoButtonIcon = (
      <FontAwesome
        className={infoButtonIconClass}
        name={infoButtonIconClass}
        style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
      />
    );
    
    return (
      <DesignToolInfoButton
        clickHandler={this.toggleDocumentationCard}
        icon={infoButtonIcon}
      />
    );
  }
  
  getOnboardModalHandlers(tutorialStep) {
    const getButtonMethods = () => {
      switch(tutorialStep) {
        case 0:
          const stepZeroRightButtonHandler = function() {
            store.dispatch(actions.incrementTutorialStep());
            store.dispatch(actions.toggleTutorialIsActive());
          }
          const stepZeroLeftButtoHandler = function() {
            store.dispatch(actions.toggleShouldRenderModal());
            this.toggleDocumentationCard();
          } 
          return { 
            handleRightButtonClick: stepZeroRightButtonHandler, 
            handleLeftButtonClick: stepZeroLeftButtoHandler.bind(this)
          }
        /*case 1:
          return {
            handleRightButtonClick: stepOneClickHandler,
            handleLeftButtonClick: () => store.dispatch(actions.decrementTutorialStep())
          }*/
        case 2:
          return {
            handleRightButtonClick: this.startTour.bind(this), 
            handleLeftButtonClick: () => store.dispatch(actions.decrementTutorialStep())
          }
        case 3:
          const stepThreeClickHandler = function() {
            store.dispatch(actions.incrementTutorialStep());
            store.dispatch(actions.updateDisabledIconExceptions([0]));
            store.dispatch(actions.toggleShouldRenderModal());
          }
          return {
            handleRightButtonClick: stepThreeClickHandler.bind(this),
            handleLeftButtonClick: this.startTour.bind(this),
            handleDidMount: this.addTooltip.bind(this, toolTips[0])
          }
        case 5: 
        return {
          handleRightButtonClick: this.restartTour.bind(this), 
          handleLeftButtonClick: () => store.dispatch(actions.decrementTutorialStep())
        }
        case 6:
          const stepThreeSixClickHandler = function() {
            store.dispatch(actions.incrementTutorialStep());
            store.dispatch(actions.toggleShouldRenderModal());
          }
          return {
            handleRightButtonClick: stepThreeSixClickHandler.bind(this),
            handleLeftButtonClick: this.startTour.bind(this),
            handleDidMount: this.addTooltip.bind(this, toolTips[1])
          }
        case 9:
          const stepNineClickHandler = function() {
            store.dispatch(actions.incrementTutorialStep());
            store.dispatch(actions.toggleShouldRenderModal());
          }
          return {
            handleRightButtonClick: stepNineClickHandler.bind(this),
            handleLeftButtonClick: () => store.dispatch(actions.decrementTutorialStep()),
            handleDidUpdate: this.addTooltip.bind(this, toolTips[2])
          }
        case 12:
          const stepTwelveClickHandler = function() {
            store.dispatch(actions.incrementTutorialStep());
            store.dispatch(actions.toggleShouldRenderModal());
            store.dispatch(actions.updateShouldRenderTodoList(true));
          }
          return {
            handleRightButtonClick: stepTwelveClickHandler.bind(this),
            handleLeftButtonClick: () => store.dispatch(actions.decrementTutorialStep()),
          }
        case 13:
          const stepThirteenClickHandler = function() {
            store.dispatch(actions.exitTutorial());
            this.toggleDocumentationCard();
          }
          return {
            handleRightButtonClick: stepThirteenClickHandler.bind(this),
          }
      
        default:
          return {
            handleRightButtonClick: () => store.dispatch(actions.incrementTutorialStep()),
            handleLeftButtonClick: () => store.dispatch(actions.decrementTutorialStep()),
          }
        } 
    }
    
    const handleCloseFunction = function() {
      store.dispatch(actions.changeModalType('CONFIRM'));
    } 
    
    const handleClose = {
      handleCloseButtonClick: handleCloseFunction.bind(this)
    }
    const buttonMethods = getButtonMethods(tutorialStep);
    const modalClass = {modalClass: `modal-step-${this.props.tutorialStep}`}
    return Object.assign(buttonMethods, handleClose, modalClass)
  }
  
  renderModal() {
    const { tutorialStep, shouldRenderModal, modalType} = this.props;
    const { tutorialSteps } = this.state;
    
    
    if (shouldRenderModal) {
      switch(modalType){
        case 'ONBOARD':
          const onboardModalMethods = this.getOnboardModalHandlers(tutorialStep);
          const onboardModalProps = Object.assign(tutorialSteps[tutorialStep], onboardModalMethods);
          
          return (
            <Modal 
              {...onboardModalProps}
            />
          );
        case 'CONFIRM':
          const rightButtonClick = function() {
            store.dispatch(actions.exitTutorial())
            this.toggleDocumentationCard();
          }
          return (
            <Modal 
              modalClass="confirm-exit-tutorial"
              text="Are you sure you want to exit the tutorial?"
              rightButtonText="Exit"
              shouldRenderLeftButton={true}
              leftButtonText="Go Back"
              handleRightButtonClick={this.rightButtonClick}
              handleLeftButtonClick={() => store.dispatch(actions.resumeTutorial())}
              handleCloseButtonClick={() => store.dispatch(actions.exitTutorial())}
            />
          );
        default:
          throw new Error('Unexpected modal type')
      }
    }
    
    return null;
  }
  
  renderFooter() {
    const { currentProjectPrice, timeLastSaved } = this.props;
    
    if(this.state.shouldRenderInfoButton) {
      return (
        <Footer
          price={currentProjectPrice}
          timeLastSaved={timeLastSaved}
        />
      );
    }
    
    return null;
  }
  
  renderBoardFrame() {
    const { tutorialStep, boardSpecs } = this.props;
  
    if (tutorialStep === 2) {
      return (
        <DesignToolBoardFrame 
          height={boardSpecs.height + 27}
          width={boardSpecs.width + 27}
          top={boardSpecs.y - 14}
          left={boardSpecs.x - 14}
        />
      );
    }
    
    return null;
  }
  
  renderTodo() {
    const { shouldRenderTodoList, todoBools } = this.props;
    
    const handleLinkClick = () => {
      store.dispatch(actions.changeModalType('CONFIRM'));
      store.dispatch(actions.toggleShouldRenderModal());
    }
    
    if(shouldRenderTodoList) {
      return (
        <DesignToolTodo 
          todoBools={todoBools}
          handleLinkClick={handleLinkClick}
        />
      );
    }
    
    return null;
  }

  render() {
    const {
      currentProjectName,
      currentProjectId,
      currentProjectPrice,
      timeLastSaved,
      showAllModuleIcons,
      iconVisibityData,
      joyride,
      todoBools
    } = this.props;
    
    const {
      isDraggingToBoard,
      shouldUpdateThumbnail,
      shouldRenderDocumentation,
      shouldRenderInfoButton,
      shouldHideContextMenu
    } = this.state;

    return (
      <div>
        {this.renderJoyride()}
        {this.renderBoardFrame()}
        
        <TopNavbar
          projectName={currentProjectName}
          handleNameChange={DesignTool.handleNameChange.bind(null, currentProjectId)}
          routeToProjects={DesignTool.routeToProjects}
          updateThumbnail={this.toggleShouldUpadateThumbnail}
          updateLastSaved={DesignTool.updateLastSaved}
          recordSavedChanges={DesignTool.recordSavedChanges}
        />
        <div onMouseMove={this.handleMouseMove.bind(this)}>
          <div ref={node => this.stageContainer = node}>
            {this.renderSideBar()}
            <DesignToolStage
              updateState={this.updateState.bind(this)}
              rotate={this.rotate.bind(this)}
              toggleShouldUpadateThumbnail={this.toggleShouldUpadateThumbnail.bind(this)}
              isDraggingToBoard={isDraggingToBoard}
              shouldRenderBoard={currentProjectName}
              shouldUpdateThumbnail={shouldUpdateThumbnail}
              draggingModule={this.getDraggingModule()}
              shouldHideContextMenu={shouldHideContextMenu}
              hideFloatingElements={this.hideFloatingElements.bind(this)}
              unhideFloatingElements={this.unhideFloatingElements.bind(this)}
            />
          </div>
        </div>
        {this.renderFooter()}
        {shouldRenderDocumentation && <DocumentationCard />}
        {shouldRenderInfoButton && this.renderInfoButton()}
        {this.renderModal()}
        {this.renderTodo()}
      </div>
    );
  }
};

const mapStateToProps = state => ({
  currentProjectName: state.currentProjectInfo.name,
  currentProjectId: state.currentProjectInfo.id,
  currentProjectPrice: state.currentProjectInfo.price,
  currentProjectModules: state.currentProjectModules.present,
  timeLastSaved: state.currentProjectInfo.timeLastSaved,
  isMouseOverModule: state.mouseEvents.isMouseOverModule,
  draggingModuleData: state.draggingModule,
  selectedModuleIndex: state.selectedModule.index,
  boardSpecs: state.boardSpecs,
  selectedModuleProps: state.selectedModule,
  anchorPositions: state.anchorPositions,
  iconVisibityData: state.iconVisibity,
  shouldRenderSideBar: state.shouldRenderSideBar,
  isTutorialActive: state.tutorial.isTutorialActive,
  tutorialStep: state.tutorial.step,
  shouldRenderTodoList: state.tutorial.shouldRenderTodoList,
  todoBools: state.tutorial.todoBools,
  shouldRenderModal: state.modal.shouldRenderModal,
  modalType: state.modal.modalType,
  hasUnsavedChanges: state.hasUnsavedChanges
});

DesignTool = withRouter(DesignTool);
export default connect(mapStateToProps)(DesignTool);

DesignTool.propTypes = {
  currentProjectName: PropTypes.string,
  currentProjectId: PropTypes.string,
  currentProjectPrice: PropTypes.string.isRequired,
  timeLastSaved: PropTypes.string,
  draggingModuleData: PropTypes.object.isRequired,
  selectedModuleIndex: PropTypes.number,
  boardSpecs: PropTypes.object.isRequired,
  selectedModuleProps: PropTypes.object.isRequired,
  anchorPositions: PropTypes.object.isRequired,
  hasUnsavedChanges: PropTypes.boolean,
  route: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};