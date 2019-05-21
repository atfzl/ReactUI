import Icon from '#/components/Icon';
import styled from '#/styled';
import * as React from 'react';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const ZoomIcon = styled(Icon)<{ disabled: boolean }>`
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
    <ZoomIcon
      onClick={() => props.increaseZoom()}
      disabled={props.zoomInDisabled}
    >
      zoom_in
    </ZoomIcon>
    <ZoomIcon
      onClick={() => props.decreaseZoom()}
      disabled={props.zoomOutDisabled}
    >
      zoom_out
    </ZoomIcon>
  </Container>
);

export default ZoomPanel;
