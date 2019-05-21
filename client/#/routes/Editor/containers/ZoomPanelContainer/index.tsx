import { EditorConstants } from '#/constants/Editor';
import { RootState } from '#/reducers';
import actions from '#/reducers/editor/actions';
import ZoomPanel from '#/routes/Editor/components/ZoomPanel';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

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
)(ZoomPanel);
