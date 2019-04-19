import * as React from 'react';
import * as styled from 'styled';

const color = 'blue';

const Button = styled.button`
  color: ${color};
`;

const SourceComponent = () => (
  <div>
    <p>Source</p>
    <input value="foo" />
    <Button>Click Me</Button>
  </div>
);

export default SourceComponent;
