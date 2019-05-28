import * as React from 'react';
import styled from 'styled-components';

const Foo = styled.div``;

const Source = () => {
  return (
    <div>
      <Foo>
        foobaring
        {Math.floor(1.2)}
      </Foo>
    </div>
  );
};

export default Source;
