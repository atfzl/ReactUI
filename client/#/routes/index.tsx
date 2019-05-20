import * as React from 'react';
import { Route } from 'react-router-dom';
import Canvas from './Canvas';

const Routes = () => {
  return (
    <>
      <Route exact path="/" component={Canvas} />
    </>
  );
};

export default Routes;
