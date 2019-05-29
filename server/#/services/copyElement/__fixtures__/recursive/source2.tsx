import * as React from 'react';
import styled from 'styled-components';

const Text = styled.div`
  font-size: 14px;
`;
const StyledText = styled(Text)`
  color: pink;
`;

const Source = () => (
  <StyledText>
    <div>sourcetext</div>
  </StyledText>
);

export default Source;
