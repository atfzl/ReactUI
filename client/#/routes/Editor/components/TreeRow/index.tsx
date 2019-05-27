import { TagCursor } from '#/common/models/file';
import Dragify from '#/components/Dragify';
import styled from '#/styled';
import * as React from 'react';

const Container = styled.div<{ selected?: boolean; hovered?: boolean }>`
  padding: 4px;
  font-size: 14px;
  cursor: pointer;

  border: 1px solid transparent;
  ${props =>
    props.selected && `border: 1px solid ${props.theme.colors.primary};`}
  ${props =>
    props.hovered && `outline: 1px dashed ${props.theme.colors.accent}`}
`;

interface Props {
  selected?: boolean;
  hovered?: boolean;
  depth: number;
  id: string;
  onClick: (id?: string) => void;
  onHover: (id?: string) => void;
  scrollIntoViewOnHover: boolean;
  cursor: TagCursor;
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

  private onClick() {
    this.props.onClick(this.props.id);
  }

  public componentDidUpdate() {
    if (this.props.hovered && this.props.scrollIntoViewOnHover) {
      this.ref.current!.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  public render() {
    const { selected, hovered, depth, cursor } = this.props;

    return (
      <Dragify cursor={cursor} onDrag={console.log} onDrop={console.log}>
        <Container
          ref={this.ref}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
          onClick={this.onClick}
          selected={selected}
          hovered={hovered}
          style={{ marginLeft: depth * 3 }}
        >
          {this.props.children}
        </Container>
      </Dragify>
    );
  }
}

export default TreeRow;
