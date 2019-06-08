import GalleryFrame from '#/routes/Editor/containers/GalleryFrame';
import GalleryOverlayLayer from '#/routes/Editor/containers/GalleryOverlayLayer';
import * as React from 'react';

interface Props {
  width: number;
}

class Gallery extends React.PureComponent<Props> {
  public render() {
    return (
      <>
        <GalleryFrame width={this.props.width} />
        <GalleryOverlayLayer />
      </>
    );
  }
}

export default Gallery;
