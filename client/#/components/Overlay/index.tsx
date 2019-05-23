import * as React from 'react';

interface Props {
  children: HTMLElement;
}

class Overlay extends React.Component<Props> {
  public render() {
    const element = this.props.children;

    const rect = element.getBoundingClientRect();

    const style: React.CSSProperties = {
      position: 'absolute',
      left: rect.left + 'px',
      right: rect.right + 'px',
      top: rect.top + 'px',
      bottom: rect.bottom + 'px',
      height: rect.height + 'px',
      width: rect.width + 'px',
      border: '1px solid blue',
    };

    return <div style={style} />;
  }
}

export default Overlay;
