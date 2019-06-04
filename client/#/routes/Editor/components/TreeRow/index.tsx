import styled from '#/styled';
import * as React from 'react';

const Container = styled.div<{
  selected?: boolean;
  hovered?: boolean;
  secondarySelected?: boolean;
}>`
  padding: 4px;
  font-size: 14px;

  border: 1px solid transparent;
  ${props =>
    props.selected && `border: 1px solid ${props.theme.colors.primary};`}
  ${props =>
    props.secondarySelected &&
    `border: 1px dashed ${props.theme.colors.accent};`}
  ${props => props.hovered && `outline: 1px solid ${props.theme.colors.accent}`}
`;

interface Props {
  selected?: boolean;
  secondarySelected?: boolean;
  hovered?: boolean;
  depth: number;
  id: string;
  onPrimaryClick: (id?: string) => void;
  onSecondaryClick: () => void;
  onHover: (id?: string) => void;
  scrollIntoViewOnHover: boolean;
}

class TreeRow extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  private ref = React.createRef<HTMLDivElement>();

  private onMouseOver() {
    this.props.onHover(this.props.id);
  }

  private onMouseOut() {
    this.props.onHover();
  }

  private onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.metaKey) {
      this.props.onSecondaryClick();
    }

    this.props.onPrimaryClick(this.props.id);
  }

  public componentDidUpdate() {
    if (this.props.hovered && this.props.scrollIntoViewOnHover) {
      this.ref.current!.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  public render() {
    const { selected, hovered, depth, secondarySelected } = this.props;

    return (
      <Container
        ref={this.ref}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onClick={this.onClick}
        selected={selected}
        secondarySelected={secondarySelected}
        hovered={hovered}
        style={{ marginLeft: depth * 3 }}
      >
        {this.props.children}
      </Container>
    );
  }
}

export default TreeRow;
