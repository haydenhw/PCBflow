import orm from '../schema/schema';

const initialState = orm.getEmptyState();

export function loadData(state, payload) {
    // Create a Redux-ORM session from our entities "tables"
    const session = orm.mutableSession(state);
    // Get a reference to the correct version of model classes for this Session
    const { Project } = session;
    const { Module } = session;

    // Clear out any existing models from state so that we can avoid
    // conflicts from the new data coming in if data is reloaded
    const { projects } = payload;
    // Immutably update the session state as we insert items
    projects.forEach((project, i) => {
      Project.create({
        name: project.name
      });

      project.modules.forEach(module => {
        const _module = Object.assign({}, module, { project: i })
        Module.create(_module);
      });
    });

    // Return the new "tables" object containing the updates
    return session.state;
}

const updateModule = (state, payload) => {
  const session = orm.session(state);
  const { Module } = session;
  Module.withId(0).update({name: 'new name'});

  return session.state;
}

export const entities = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_ORM':
      const res = loadData(state, action.payload);
      return loadData(state, action.payload)
    case 'UPDATE_MODULE':
      return updateModule(state, action.payload)
    default:
      return state;
  }
};