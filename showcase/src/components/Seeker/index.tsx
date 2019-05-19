import * as formatDuration from 'format-duration';
import * as React from 'react';
import styled from 'styled-components';

const SeekContainer = styled.div`
  padding: 0 18px;
  margin-bottom: 9px;
`;

const SeekLineWrapper = styled.div`
  height: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SeekLine = styled.div`
  height: 2px;
  background-color: #dedede;
`;

const SeekTimelineWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 9px;
`;

interface IProps {
  currentTime: number;
  endTime: number;
}

const Seeker: React.SFC<IProps> = props => (
  <SeekContainer>
    <SeekLineWrapper>
      <SeekLine />
    </SeekLineWrapper>
    <SeekTimelineWrapper>
      <div>{formatDuration(props.currentTime * 1000)}</div>
      <div>{formatDuration(props.endTime * 1000)}</div>
    </SeekTimelineWrapper>
  </SeekContainer>
);

export default Seeker;
