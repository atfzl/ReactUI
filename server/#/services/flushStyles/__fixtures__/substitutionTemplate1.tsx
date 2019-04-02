import * as styled from 'styled';

const Foo = styled.div`
  color: red;
  display: ${props => (props.foo ? 'flex' : 'block' && true)};
  ${props => props.bar && 'cursor: pointer;'}
  background-color: red;
`;

export default Foo;
