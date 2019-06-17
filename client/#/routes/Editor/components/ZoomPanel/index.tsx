import styled from '#/styled';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import * as React from 'react';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  ${props => props.disabled && `opacity: 0.3;`}
  ${props => props.disabled && 'pointer-events: none;'}
`;

interface Props {
  zoomLevel: number;
  zoomInDisabled: boolean;
  zoomOutDisabled: boolean;
  increaseZoom: () => void;
  decreaseZoom: () => void;
}

const ZoomPanel: React.SFC<Props> = props => (
  <Container>
    <IconWrapper
      onClick={() => props.increaseZoom()}
      disabled={props.zoomInDisabled}
      title="Zoom In"
    >
      <ZoomIn />
    </IconWrapper>
    <IconWrapper
      onClick={() => props.decreaseZoom()}
      disabled={props.zoomOutDisabled}
      title="Zoom Out"
    >
      <ZoomOut />
    </IconWrapper>
  </Container>
);

export default ZoomPanel;
