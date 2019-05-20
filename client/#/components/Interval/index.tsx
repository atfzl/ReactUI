import * as React from 'react';

interface State {
  time: number;
}

class Interval extends React.Component<{}, State> {
  public state = {
    time: 0,
  };

  private interval?: any;

  public componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(state => ({ time: state.time + 4000 }));
    }, 4000);
  }

  public componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  public render() {
    return <div>{this.state.time} ms</div>;
  }
}

export default Interval;
