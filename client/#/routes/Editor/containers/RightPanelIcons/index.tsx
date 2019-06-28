import styled from '#/styled';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import Style from '@material-ui/icons/Style';
import * as React from 'react';
import { Link } from 'react-router-dom';

const Container = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${props => props.theme.colors.border[50]};
  z-index: 1;
`;

const IconWrapper = styled(Link)`
  border-top: 1px solid ${props => props.theme.colors.border[50]};
  border-left: 2px solid ${props => props.theme.colors.border[50]};
  border-right: 1px solid ${props => props.theme.colors.border[50]};
  border-bottom: 1px solid ${props => props.theme.colors.border[50]};
  display: flex;
  cursor: pointer;
`;

const PhotoLibraryIcon = styled(PhotoLibrary)<{ selected?: boolean }>`
  padding: 2px 2px 3px 2px;
  font-size: 22px;
  background-color: white;
  color: rgba(0, 0, 0, 0.7);

  ${props =>
    props.selected &&
    `
    color: white;
    background-color: rgba(0, 0, 0, 0.7);
  `}

  &:hover {
    color: white;
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const StyleIcon = PhotoLibraryIcon.withComponent(Style);

class RightPanelIcons extends React.Component {
  public render() {
    const locationHash = window.location.hash;

    return (
      <Container>
        <IconWrapper to="/">
          <PhotoLibraryIcon selected={locationHash === '#/'} />
        </IconWrapper>
        <IconWrapper to="/style">
          <StyleIcon selected={locationHash === '#/style'} />
        </IconWrapper>
      </Container>
    );
  }
}

export default RightPanelIcons;
