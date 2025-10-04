import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const Time = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const now = new Date()

export default function Header() {
  return (
    <HeaderContainer>
      <Title>TODO-BASIC</Title>
      <Time>Moscow-time: {now.toLocaleTimeString()}</Time>
    </HeaderContainer>
  );
}