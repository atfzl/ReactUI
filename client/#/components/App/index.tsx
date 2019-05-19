import { RootState } from '#/reducers';
import actions from '#/reducers/global/actions';
import * as React from 'react';
import { connect } from 'react-redux';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type Props = StateProps & DispatchProps;

class App extends React.PureComponent<Props> {
  public componentDidMount() {
    // tslint:disable-next-line:no-console
    console.log('App loaded');

    this.props.ping();
  }

  public render() {
    return <div>App: {this.props.message}</div>;
  }
}

const mapStateToProps = (state: RootState) => ({
  message: state.global.message,
});

const mapDispatchToProps = {
  ping: actions.ping,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
