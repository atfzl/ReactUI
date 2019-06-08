import * as loadingSVG from '#/images/loading-cylon.svg';
import { RootState } from '#/reducers';
import styled from '#/styled';
import * as React from 'react';
import { connect } from 'react-redux';

const Container = styled.div`
  display: flex;
  justify-content: center;
  left: calc(50% - 16px);
  position: absolute;
`;

const Loader = styled.img`
  color: ${props => props.theme.palette.gray80};
`;

type StateProps = ReturnType<typeof mapStateToProps>;

interface Props extends StateProps {}

class ProgressIndicator extends React.PureComponent<Props> {
  public render() {
    if (!this.props.loading) {
      return null;
    }

    return (
      <Container>
        <Loader src={loadingSVG} />
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loading: state.editor.loading,
});

export default connect(mapStateToProps)(ProgressIndicator);
