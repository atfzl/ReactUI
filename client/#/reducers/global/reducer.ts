import actions from '#/reducers/global/actions';
import { immerCase } from '#/utils';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

export interface ReducerState {
  message: string;
}

const InitialState: ReducerState = { message: 'hello' };

const reducer = reducerWithInitialState<ReducerState>(InitialState)
  .withHandling(
    immerCase(actions.ping, draft => {
      draft.message = 'PING';
    }),
  )
  .withHandling(
    immerCase(actions.pong, draft => {
      draft.message = 'PONG';
    }),
  )
  .build();

export default reducer;
