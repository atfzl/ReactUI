import GalleryFrame from '#/routes/Editor/containers/GalleryFrame';
import GalleryOverlayLayer from '#/routes/Editor/containers/GalleryOverlayLayer';
import styled from '#/styled';
import * as React from 'react';

const Container = styled.div`
  position: absolute;
  top: 0;
`;

interface Props {
  width: number;
}

class Gallery extends React.PureComponent<Props> {
  public render() {
    return (
      <Container>
        <GalleryFrame width={this.props.width} />
        <GalleryOverlayLayer />
      </Container>
    );
  }
}

export default Gallery;
