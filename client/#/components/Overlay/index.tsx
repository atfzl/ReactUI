import styled from '#/styled';
import * as React from 'react';

const Container = styled.div<{
  selected?: boolean;
  hovered?: boolean;
  secondarySelected?: boolean;
}>`
  position: absolute;

  ${props =>
    props.selected && `border: 1px solid ${props.theme.colors.primary};`}
  ${props =>
    props.secondarySelected &&
    `border: 1px dashed ${props.theme.colors.accent};`}
  ${props => props.hovered && `outline: 1px solid ${props.theme.colors.accent}`}
`;

interface Props {
  id: string;
  children: HTMLElement;
  selected?: boolean;
  secondarySelected?: boolean;
  hovered?: boolean;
  onPrimaryClick?: (id?: string) => void;
  onHover?: (id?: string) => void;
  onSecondaryClick?: () => void;
}

class Overlay extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  private onMouseOver() {
    if (this.props.onHover) {
      this.props.onHover(this.props.id);
    }
  }

  private onMouseOut() {
    if (this.props.onHover) {
      this.props.onHover(undefined);
    }
  }

  private onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.metaKey) {
      if (this.props.onSecondaryClick) {
        this.props.onSecondaryClick();
      }
    }

    if (this.props.onPrimaryClick) {
      this.props.onPrimaryClick(this.props.id);
    }
  }

  public render() {
    const { children, selected, hovered, secondarySelected } = this.props;

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
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        selected={selected}
        secondarySelected={secondarySelected}
        hovered={hovered}
        style={style}
      />
    );
  }
}

export default Overlay;
