import Ref from '#/components/Ref';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Props {
  maxWidth: number;
  children?: React.ReactNode;
  childRef?: (element: HTMLElement | null) => void;
}

interface State {
  style?: React.CSSProperties;
}

class AutoScale extends React.PureComponent<Props, State> {
  private componentRef = React.createRef<any>();

  public state: State = {};

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

      const setChildRef = () => {
        if (this.props.childRef) {
          this.props.childRef(element.children[0] as HTMLElement | null);
        }
      };

      if (scale < 1) {
        const newHeight = scale * height;

        this.setState(
          {
            style: {
              transformOrigin: '0px 0px 0px',
              transform: `scale(${scale})`,
              maxWidth: scale * width,
              height: newHeight,
            },
          },
          setChildRef,
        );
      } else {
        setChildRef();
      }
    }
  }

  public componentDidMount() {
    this.recalculate();
  }

  public componentWillUnmount() {
    if (this.props.childRef) {
      this.props.childRef(null);
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      this.state.style === prevState.style &&
      this.props.children !== prevProps.children
    ) {
      this.setState({ style: undefined }, () => {
        this.recalculate();
      });
    }
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
