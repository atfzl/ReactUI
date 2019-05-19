import * as React from 'react';
import styled from 'styled-components';

const PauseIconCircle = styled.div`
  border-radius: 50%;
  height: 42px;
  width: 42px;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.38);
  background-color: #6af0af;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 16px;
`;

const PauseIcon = styled.i.attrs({
  children: 'pause',
  className: 'material-icons',
})`
  font-size: 24px;
`;

const NextPrevIcon = styled.i.attrs({
  className: 'material-icons',
})`
  font-size: 28px;
  color: grey;
`;

const PlayIconsCollection = styled.div`
  display: flex;
  align-items: center;
`;

const PlayControl = () => (
  <PlayIconsCollection>
    <NextPrevIcon>skip_previous</NextPrevIcon>
    <PauseIconCircle>
      <PauseIcon />
    </PauseIconCircle>
    <NextPrevIcon>skip_next</NextPrevIcon>
  </PlayIconsCollection>
);

export default PlayControl;
