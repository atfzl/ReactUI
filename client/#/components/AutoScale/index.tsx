import Ref from '#/components/Ref';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IProps {
  maxWidth: number;
}

interface IState {
  style?: React.CSSProperties;
}

class AutoScale extends React.Component<IProps, IState> {
  private componentRef = React.createRef<any>();

  public state: IState = {};

  private recalculate() {
    if (this.componentRef) {
      const element = ReactDOM.findDOMNode(this.componentRef.current) as
        | HTMLElement
        | undefined;

      if (!element) {
        return;
      }

      const { width, height } = element.getBoundingClientRect();

      const scale = this.props.maxWidth / width;

      if (scale < 1) {
        const newHeight = scale * height;

        this.setState({
          style: {
            transformOrigin: '0px 0px 0px',
            transform: `scale(${scale})`,
            maxWidth: scale * width,
            height: newHeight,
          },
        });
      }
    }
  }

  public componentDidMount() {
    this.recalculate();
  }

  public componentDidUpdate() {
    this.recalculate();
  }

  public render() {
    return (
      <Ref ref={this.componentRef} style={this.state.style}>
        {this.props.children}
      </Ref>
    );
  }
}

export default AutoScale;
