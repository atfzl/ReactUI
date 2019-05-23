import * as React from 'react';

interface Props {
  children: HTMLElement;
}

interface State {
  style: React.CSSProperties;
}

class Overlay extends React.Component<Props> {
  public state: State = { style: {} };

  public componentDidMount() {
    const element = this.props.children;

    const rect = element.getBoundingClientRect();

    this.setState({ style: { ...rect, border: '1px solid blue' } });
  }

  public render() {
    return <div style={this.state.style} />;
  }
}

export default Overlay;
