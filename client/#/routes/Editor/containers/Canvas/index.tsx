import Isolate from '#/components/Isolate';
import actions from '#/reducers/editor/actions';
import styled from '@emotion/styled';
import * as React from 'react';
import { connect } from 'react-redux';

const Wrapper = styled.div`
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
  display: inline-block;
`;

type DispatchProps = typeof mapDispatchToProps;

interface Props extends DispatchProps {}

class Canvas extends React.PureComponent<Props> {
  public render() {
    return (
      <Wrapper>
        <Isolate onReady={this.props.setCanvasInternals} />
      </Wrapper>
    );
  }
}

const mapDispatchToProps = {
  setCanvasInternals: actions.setCanvasInternals,
};

export default connect(
  null,
  mapDispatchToProps,
)(Canvas);
