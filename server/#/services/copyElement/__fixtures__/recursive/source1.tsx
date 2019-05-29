import * as React from 'react';
import styled from 'styled-components';
import Container from './components/Container';
import Icon from './components/Icon';

const AIcon = styled(Icon)``;

const BIcon = styled(Icon)``;

const Foobar = () => {
  return (
    <Container>
      <AIcon />
      <BIcon />
    </Container>
  );
};

export default Foobar;
