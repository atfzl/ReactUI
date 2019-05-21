import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('EDITOR');

const actions = {
  ping: actionCreator('ping'),
  pong: actionCreator('pong'),
};

export default actions;
