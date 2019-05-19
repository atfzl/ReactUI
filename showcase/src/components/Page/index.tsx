import * as React from 'react';
import styled from 'styled-components';
import AlbumArt from '../AlbumArt';
import NavigationBar from '../NavigationBar';
import PlayControl from '../PlayControl';
import Seeker from '../Seeker';

const Container = styled.div`
  height: 600px;
  width: 337.5px;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const albumArtWrapperDimensions = '337.5';

const AlbumArtWrapper = styled.div`
  width: ${albumArtWrapperDimensions}px;
  height: ${albumArtWrapperDimensions}px;
  padding: 13px;
`;

const BottomFlexWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const SongDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SongTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const SongArtist = styled.div`
  font-size: 12px;
  color: grey;
`;

const PlayControlRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

const RepeatIcon = styled.i.attrs({
  children: 'repeat',
  className: 'material-icons',
})`
  font-size: 20px;
  color: #dedede;
`;

const ShuffleIcon = styled.i.attrs({
  children: 'shuffle',
  className: 'material-icons',
})`
  font-size: 20px;
  color: grey;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 16px;
  width: 100%;
`;

const CloseIcon = styled.i.attrs({
  className: 'material-icons',
  children: 'close',
})`
  color: grey;
  font-size: 19px;
`;

const BottomRightIconsGroup = styled.div`
  margin-right: 24px;
  display: flex;
  align-items: center;
`;

const FavoriteIcon = styled.i.attrs({
  className: 'material-icons',
  children: 'favorite_border',
})`
  color: grey;
  font-size: 19px;
  margin-right: 16px;
`;

const PlaylistPlayIcon = styled.i.attrs({
  className: 'material-icons',
  children: 'playlist_play',
})`
  color: grey;
  font-size: 20px;
`;

class Page extends React.Component<
  {},
  { currentTime: number; endTime: number }
> {
  public state = { currentTime: 0, endTime: 60 };

  private interval = null;

  public componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(state => ({
        currentTime: state.currentTime + 1,
        endTime: state.endTime + 1,
      }));
    }, 10000);
  }

  public componentWillUnmount() {
    clearInterval(this.interval);
  }

  public render() {
    return (
      <Container>
        <NavigationBar />
        <AlbumArtWrapper>
          <AlbumArt src="http://blog.iso50.com/wp-content/uploads/2013/12/Awake-450.jpg" />
        </AlbumArtWrapper>
        <Seeker
          currentTime={this.state.currentTime}
          endTime={this.state.endTime}
        />
        <BottomFlexWrapper>
          <SongDetailsWrapper>
            <SongTitle>Awake</SongTitle>
            <SongArtist>Tycho</SongArtist>
          </SongDetailsWrapper>
          <PlayControlRow>
            <RepeatIcon />
            <PlayControl />
            <ShuffleIcon />
          </PlayControlRow>
          <BottomRow>
            <CloseIcon />
            <BottomRightIconsGroup>
              <FavoriteIcon />
              <PlaylistPlayIcon />
            </BottomRightIconsGroup>
          </BottomRow>
        </BottomFlexWrapper>
      </Container>
    );
  }
}

export default Page;
