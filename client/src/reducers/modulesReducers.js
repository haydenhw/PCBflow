import * as actions from '../actions/indexActions';
import * as types from '../constants/actionTypes';

const defaultState =  {
  draggingModule: {},
  hovered: null,
  clickedIndex: null,
}

export const modules = (state = defaultState, action) => {
  switch (action.type) {
    case actions.UPDATE_DRAGGING_MODULE:
      return {
        ...state,
        draggingModule: action.dragginModule,
      }
    case actions.UPDATE_HOVERED_MODULE:
      return {
        ...state,
        hovered: action.moduleData,
      }
    case actions.UPDATE_CLICKED_MODULE:
      return {
        ...state,
        clickedIndex: action.index
      };
    case types.ENTITY_DELETE:
      const { itemType } = action.payload;

      if (itemType === 'Module') {
        return {
          ...state,
          hovered: null,
        };
      }

      return state;
    default:
      return state;
  }
};
