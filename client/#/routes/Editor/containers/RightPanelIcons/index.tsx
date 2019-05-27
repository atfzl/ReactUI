import Icon from '#/components/Icon';
import styled from '#/styled';
import * as React from 'react';

const Container = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${props => props.theme.colors.border.main};
`;

const IconWrapper = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border.main};
  border-left: 2px solid ${props => props.theme.colors.border.main};
  border-right: 1px solid ${props => props.theme.colors.border.main};
  border-bottom: 1px solid ${props => props.theme.colors.border.main};
  display: flex;
  cursor: pointer;
`;

const StyledIcon = styled(Icon)<{ selected?: boolean }>`
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

class RightPanelIcons extends React.Component {
  public render() {
    return (
      <Container>
        <IconWrapper>
          <StyledIcon selected>photo_library</StyledIcon>
        </IconWrapper>
        <IconWrapper>
          <StyledIcon>style</StyledIcon>
        </IconWrapper>
        <IconWrapper>
          <StyledIcon>reorder</StyledIcon>
        </IconWrapper>
      </Container>
    );
  }
}

export default RightPanelIcons;
