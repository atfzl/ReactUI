import styled from '#/styled';
import * as React from 'react';

const Container = styled.div<{ active?: boolean }>`
  position: absolute;
  cursor: move;
  ${props => props.active && 'border: 1px solid blue;'}

  &:hover {
    border: 1px dashed #f400b5;
  }
`;

interface Props {
  children: HTMLElement;
  active?: boolean;
}

class Overlay extends React.Component<Props> {
  public render() {
    const { children: element, active = true } = this.props;

    const rect = element.getBoundingClientRect();

    const style: React.CSSProperties = {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      height: rect.height,
      width: rect.width,
    };

    return <Container active={active} style={style} />;
  }
}

export default Overlay;
