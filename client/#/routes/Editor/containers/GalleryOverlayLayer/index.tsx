import Overlay from '#/components/Overlay';
import { RootState } from '#/reducers';
import * as React from 'react';
import { connect } from 'react-redux';

type StateProps = ReturnType<typeof mapStateToProps>;

interface Props extends StateProps {}

class GalleryOverlayLayer extends React.PureComponent<Props> {
  public render() {
    return (
      <>
        {this.props.instanceWrappers.map(wrapper => {
          const child = wrapper && wrapper.element;

          return (
            child && (
              <Overlay key={wrapper.id} id={wrapper.id}>
                {child}
              </Overlay>
            )
          );
        })}
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  instanceWrappers: state.gallery.instanceWrappers,
});

export default connect(mapStateToProps)(GalleryOverlayLayer);
