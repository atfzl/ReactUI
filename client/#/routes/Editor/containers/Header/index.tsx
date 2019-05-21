import Icon from '#/components/Icon';
import { EditorConstants } from '#/constants/Editor';
import { RootState } from '#/reducers';
import actions from '#/reducers/editor/actions';
import styled from '#/styled';
import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

const Container = styled.div`
  background-color: #fdf9f3;
  border-bottom: 1px solid ${props => props.theme.colors.border.main};
  flex: 0 0 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 6px;
`;

const ZoomIcon = styled(Icon)<{ disabled: boolean }>`
  cursor: pointer;
  user-select: none;
  ${props => props.disabled && `opacity: 0.3;`}
  ${props => props.disabled && 'pointer-events: none;'}
`;

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

interface Props extends StateProps, DispatchProps {}

const Header: React.SFC<Props> = props => (
  <Container>
    <ZoomIcon
      onClick={() => props.increaseZoom()}
      disabled={props.zoomInDisabled}
    >
      zoom_in
    </ZoomIcon>
    <ZoomIcon
      onClick={() => props.decreaseZoom()}
      disabled={props.zoomOutDisabled}
    >
      zoom_out
    </ZoomIcon>
  </Container>
);

const zoomInDisabledSelector = createSelector(
  (state: RootState) => state.editor.zoomLevel,
  zoomLevel => zoomLevel >= EditorConstants.MAXIMUM_ZOOM,
);

const zoomOutDisabledSelector = createSelector(
  (state: RootState) => state.editor.zoomLevel,
  zoomLevel => zoomLevel <= EditorConstants.MINIMUM_ZOOM,
);

const mapStateToProps = (state: RootState) => ({
  zoomLevel: state.editor.zoomLevel,
  zoomInDisabled: zoomInDisabledSelector(state),
  zoomOutDisabled: zoomOutDisabledSelector(state),
});

const mapDispatchToProps = {
  increaseZoom: actions.increaseZoom,
  decreaseZoom: actions.decreaseZoom,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
