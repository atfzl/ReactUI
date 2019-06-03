import * as React from 'react';

type Props = JSX.IntrinsicElements['div'];

class Ref extends React.Component<Props> {
  public render() {
    return <div {...this.props}>{this.props.children}</div>;
  }
}

export default Ref;
