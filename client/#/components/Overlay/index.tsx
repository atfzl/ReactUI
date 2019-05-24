import styled from '#/styled';
import * as React from 'react';

const Container = styled.div<{ selected?: boolean; hovered?: boolean }>`
  position: absolute;
  ${props =>
    props.selected && `border: 1px solid ${props.theme.colors.primary};`}

  &:hover {
    ${props =>
      props.hovered && `outline: 1px dashed ${props.theme.colors.accent}`}
  }
`;

interface Props {
  id: string;
  children: HTMLElement;
  selected?: boolean;
  hovered?: boolean;
  onClick: (id?: string) => void;
  onHover: (id?: string) => void;
}

class Overlay extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  public onMouseOver() {
    this.props.onHover(this.props.id);
  }

  public onMouseOut() {
    this.props.onHover(undefined);
  }

  public render() {
    const { id, children, selected, hovered, onClick } = this.props;

    const rect = children.getBoundingClientRect();

    const style: React.CSSProperties = {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      height: rect.height,
      width: rect.width,
    };

    return (
      <Container
        onClick={() => onClick(id)}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        selected={selected}
        hovered={hovered}
        style={style}
      />
    );
  }
}

export default Overlay;
