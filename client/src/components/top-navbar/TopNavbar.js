import React from 'react';
import FontAwesome from 'react-fontawesome';

import TopNavbarEditableText from './TopNavbarEditableText';
import TopNavbarSaveButton from './TopNavbarSaveButton';
import TopNavbarUndoButton from './TopNavbarUndoButton';

import './top-navbar-styles/TopNavbar.css';

const titleStyle = {
  color: 'white',
  fontSize: '20px',
};

export default function TopNavbar(props) {
  const handleFolderIconClick = () => {
    props.updateThumbnail();
    props.routeToProjects();
  };

  return (
    <div className="navWide">
      <div className="iconWrapper" onClick={handleFolderIconClick}>
        <FontAwesome
          className="fa-folder-open"
          name="fa-folder-open"
          style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
        />
      </div>
      <TopNavbarEditableText
        text={props.projectName}
        handleNameChange={props.handleNameChange}
      />
      <TopNavbarSaveButton
        updateThumbnail={props.updateThumbnail}
        updateLastSaved={props.updateLastSaved}
        recordSavedChanges={props.recordSavedChanges}
      />
    </div>
  );
}
