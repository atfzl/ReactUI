import Editor from '#/routes/Editor';
import * as React from 'react';
import { Route } from 'react-router-dom';

const Routes = () => {
  return (
    <>
      <Route exact path="/" component={Editor} />
    </>
  );
};

export default Routes;
