import styled from '#/styled';
import * as React from 'react';

const Container = styled.div`
  border: 1px solid blue;

  &:hover {
    border: 1px dashed #f400b5;
  }
`;

interface Props {
  children: HTMLElement;
}

class Overlay extends React.Component<Props> {
  public render() {
    const { children: element } = this.props;

    const rect = element.getBoundingClientRect();

    const style: React.CSSProperties = {
      position: 'absolute',
      left: rect.left + 'px',
      right: rect.right + 'px',
      top: rect.top + 'px',
      bottom: rect.bottom + 'px',
      height: rect.height + 'px',
      width: rect.width + 'px',
    };

    return <Container style={style} />;
  }
}

export default Overlay;
