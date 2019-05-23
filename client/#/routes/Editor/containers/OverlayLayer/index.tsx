import Overlay from '#/components/Overlay';
import { RootState } from '#/reducers';
import * as React from 'react';
import { connect } from 'react-redux';

type StateProps = ReturnType<typeof mapStateToProps>;

interface Props extends StateProps {}

class OverlayLayer extends React.Component<Props> {
  public render() {
    const { nodeMap } = this.props;

    return Object.keys(nodeMap).map(id => {
      const { nativeNode, fiberNode } = nodeMap[id];

      if (!nativeNode || !fiberNode._debugSource) {
        return null;
      }

      return <Overlay key={id}>{nativeNode}</Overlay>;
    });
  }
}

const mapStateToProps = (state: RootState) => ({
  nodeMap: state.editor.nodeMap,
});

export default connect(mapStateToProps)(OverlayLayer);
