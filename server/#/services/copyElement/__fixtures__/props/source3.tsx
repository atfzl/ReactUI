import * as React from 'react';
import styled from 'styled-components';

const Foo = styled.div``;

const Source = () => {
  return (
    <div>
      <Foo>{Math.floor(2.9)}</Foo>
    </div>
  );
};

export default Source;
