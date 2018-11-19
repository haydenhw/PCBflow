import { combineReducers } from 'redux';
import { undoable } from 'helpers/undoable';

import { anchors } from './anchorReducer';
import { modules } from './modulesReducer';
import { entities } from './entitiesReducer';
import { projects } from './projectReducer';
import { mouseEvents } from './mouseEventReducer';
import { nav } from './navReducer';
import { sideBar } from './sideBarReducer';
import { triggers } from './triggersReducer';
import { tutorial } from './tutorialReducer';
import { modal } from './modalReducer';

export default combineReducers({
  entities: undoable(entities),
  anchors,
  modal,
  modules,
  mouseEvents,
  nav,
  projects,
  sideBar,
  triggers,
  tutorial,
});
