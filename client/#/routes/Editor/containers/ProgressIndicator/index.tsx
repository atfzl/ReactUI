import * as loadingSVG from '#/images/loading-cylon.svg';
import styled from '#/styled';
import * as React from 'react';

const Container = styled.div`
  display: flex;
  justify-content: center;
  left: -16px;
  position: relative;
`;

const Loader = styled.img`
  color: ${props => props.theme.palette.gray80};
`;

class ProgressIndicator extends React.PureComponent {
  public render() {
    return (
      <Container>
        <Loader src={loadingSVG} />
      </Container>
    );
  }
}

export default ProgressIndicator;
