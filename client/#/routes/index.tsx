import * as React from 'react';
import { Route } from 'react-router-dom';
import Editor from './Editor';

const Routes = () => {
  return (
    <>
      <Route exact path="/" component={Editor} />
    </>
  );
};

export default Routes;
