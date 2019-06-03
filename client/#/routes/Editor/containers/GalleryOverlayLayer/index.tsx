import Dragify from '#/components/Dragify';
import Overlay from '#/components/Overlay';
import { RootState } from '#/reducers';
import * as React from 'react';
import { connect } from 'react-redux';

type StateProps = ReturnType<typeof mapStateToProps>;

interface Props extends StateProps {}

class GalleryOverlayLayer extends React.PureComponent<Props> {
  public render() {
    const { instanceWrappers } = this.props;

    return (
      <>
        {instanceWrappers.map((wrapper, i) => {
          const child = wrapper && wrapper.element;

          return (
            child && (
              <Dragify
                key={i}
                tagName={child.tagName.toLowerCase()}
                cursor={wrapper.cursor}
                onDrop={console.log}
              >
                <Overlay key={wrapper.id} id={wrapper.id}>
                  {child}
                </Overlay>
              </Dragify>
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
