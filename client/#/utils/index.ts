import { StyleObject } from '#/common/models/Style';
import { produce } from 'immer';
import { ActionCreator } from 'typescript-fsa';
import { ReducerBuilder } from 'typescript-fsa-reducers';

export function immerCase<S, P>(
  actionCreator: ActionCreator<P>,
  handler: (draft: S, payload: P) => void,
): (reducer: ReducerBuilder<S>) => ReducerBuilder<S> {
  return reducer =>
    reducer.case(actionCreator, (state, payload) =>
      produce(state, draft => handler(draft as S, payload)),
    );
}

export function executeScript(url: string, doc: Document = document) {
  const script = doc.createElement('script');
  script.src = url;
  doc.body.appendChild(script);
}

export const parseStyles = (str: string) => {
  const styleObj: StyleObject = [];

  const styleRegex = /(.*):(.*);/g;

  let x;
  // tslint:disable-next-line:no-conditional-assignment
  while ((x = styleRegex.exec(str))) {
    styleObj.push({ key: x[1].trim(), value: x[2].trim() });
  }

  return styleObj;
};
