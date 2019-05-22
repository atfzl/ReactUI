import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  color: grey;
  font-size: 13px;
`;

const Text = styled.div``;

const BatteryPercentageText = styled(Text)`
  margin-left: 4px;
`;

const MaterialIcon = styled.i.attrs({
  className: 'material-icons',
})`
  font-size: inherit;
`;

const RightIconsRowContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StatusBar = () => (
  <Container>
    <div>
      <Text>12:26</Text>
    </div>
    <RightIconsRowContainer>
      <MaterialIcon>location_on</MaterialIcon>
      <MaterialIcon>alarm</MaterialIcon>
      <MaterialIcon>bluetooth_connected</MaterialIcon>
      <MaterialIcon>signal_cellular_null</MaterialIcon>
      <BatteryPercentageText>98%</BatteryPercentageText>
      <MaterialIcon>battery_full</MaterialIcon>
    </RightIconsRowContainer>
  </Container>
);

export default StatusBar;
