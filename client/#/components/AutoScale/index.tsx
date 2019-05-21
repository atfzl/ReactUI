import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IProps {
  maxWidth: number;
}

interface IState {
  style?: React.CSSProperties;
}

class Ref extends React.Component {
  public render() {
    return this.props.children;
  }
}

// tslint:disable-next-line:max-classes-per-file
class AutoScale extends React.Component<IProps, IState> {
  private componentRef?: React.RefObject<any> = React.createRef();

  public state: IState = {};

  public componentDidMount() {
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
            height: newHeight,
          },
        });
      }
    }
  }

  public render() {
    if (this.state.style) {
      return <div style={this.state.style}>{this.props.children}</div>;
    }
    return <Ref ref={this.componentRef}>{this.props.children}</Ref>;
  }
}

export default AutoScale;
