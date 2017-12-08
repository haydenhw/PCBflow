import React, { Component } from 'react';
import { connect } from 'react-redux';
import Konva from 'konva';
import shortid from 'shortid';
import PropTypes from 'prop-types';

import * as actions from 'actions/indexActions';
import confirm from 'helpers/confirm';
import store from 'reduxFiles/store';

import ProjectsItem from './ProjectsItem';
import ProjectsItemFrame from './ProjectsItemFrame';

import './projects-styles/floatGrid.css';
import './projects-styles/ProjectsItemFrame.css';

function convertToUrl(json, cont) {
    // const json = '{"attrs":{"width":578,"height":200},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"width":"auto","height":"auto","text":"Text Shadow!","fontFamily":"Calibri","fontSize":95,"x":20,"y":20,"stroke":"red","strokeWidth":2,"shadowColor":"black","shadowBlur":2,"shadowOffsetX":10,"shadowOffsetY":10,"shadowOpacity":0.5},"className":"Text"},{"attrs":{"stroke":"green","strokeWidth":10,"lineJoin":"round","lineCap":"round","points":[{"x":50,"y":140},{"x":450,"y":160}],"shadowColor":"black","shadowBlur":10,"shadowOffsetX":5,"shadowOffsetY":5,"shadowOpacity":0.5},"className":"Line"},{"attrs":{"x":280,"y":100,"width":100,"height":50,"fill":"#00D2FF","stroke":"black","strokeWidth":4,"shadowColor":"black","shadowBlur":10,"shadowOffsetX":5,"shadowOffsetY":5,"shadowOpacity":0.5,"rotation":0.3490658503988659,"id":"blueRectangle"},"className":"Rect"},{"attrs":{"x":100,"y":41,"width":106,"height":118,"id":"yodaImage"},"className":"Image"}]}]}';
    console.log(JSON.stringify(JSON.parse(json),null,2))
  return json ? Konva.Node.create(json, cont).toDataURL() : null;
}

class ProjectList extends Component {
  static defaultProps = {
    projects: []
  }

  static confirmDelete(projectId, projectName) {
    store.dispatch(actions.confirmProjectDelete({
      projectId,
      projectName
    }));
  }

  componentDidMount() {
    store.dispatch(actions.fetchProjects());
  }

  renderProjectItem(project) {
    const { isFetching } = this.props;

    if (isFetching) {
      return <span key={shortid.generate()}>Loading...</span>
    }

    return (
      <ProjectsItem
        projectId={project._id}
        projectName={project.name}
      />
    );
  }

  render() {
    const { projects, isFetching } = this.props;

    const projectsList = projects.map((project) => {
      const thumbnailSrc = convertToUrl(project.boardSpecs.thumbnail, this.cont);
      return (
        <ProjectsItemFrame
          key={shortid.generate()}
          thumbnailSrc={thumbnailSrc}
          projectId={project._id}
          projectName={project.name}
          confirmDelete={ProjectList.confirmDelete}
          >
            {this.renderProjectItem(project)}
          </ProjectsItemFrame>
        );
      });

      return (
        <div className="thumbnail-row">
          <div className="row-project">
            <div className="" style={{ display: "none" }} ref={(node) => {this.cont = node}}></div>
            <div className="col-wrapper card">
              {projectsList}
            </div>
          </div>
        </div>
      );
    }
  }

const mapStateToProps = state => ({
  projects: state.projects.items,
  isFetching: state.projects.isFetching,
  thumbnail: state.boardSpecs.thumbnail,
});

export default connect(mapStateToProps)(ProjectList);
