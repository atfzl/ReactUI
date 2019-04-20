import * as React from 'react';
import * as styled from 'styled';
import * as styled_$ from 'styled';

const color = 'blue';

const Button_$ = styled_$.button`
  color: red;
`;

const Button = styled.button`
  color: ${color};
`;

const SourceComponent = () => (
  <div>
    <p>Source</p>
    <input value="foo" />
    <Button>Click Me</Button>
    <Button_$>Click Me 2</Button_$>
  </div>
);

export default SourceComponent;
