import React from 'react';
import PropTypes from 'prop-types';

import * as actions from 'actions/indexActions';
import store from 'reduxFiles/store';

import DeleteButton from './ProjectsDeleteButton';

import './projects-styles/ProjectsItemFrame.css';
import './projects-styles/floatGrid.css';

function fectchProject(projectId) {
  store.dispatch(actions.fetchProjectById(projectId));
}

export default function ProjectsItemFrame(props) {
  return (
    <div className="col3-project">
      <div className="project-card">
        <div
          className="thumbnail-image"
          style={{ backgroundImage: `url(${props.thumbnailSrc})`}}
          onClick={() => fectchProject(props.projectId)}
          role="button"
        >
        </div>
        <div className="title-bar">
          <div className="title">
            {props.projectName}
          </div>
          <DeleteButton handleClick={props.confirmDelete} />
        </div>
      </div>
    </div>

  );
}

ProjectsItemFrame.propTypes = {
  projectId: PropTypes.string,
  projectName: PropTypes.string.isRequired,
  thumbnailSrc: PropTypes.string.isRequired,
  confirmDelete: PropTypes.func.isRequired,
};
