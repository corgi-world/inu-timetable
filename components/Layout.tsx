import React from 'react';
import Navigation from './Navigation';
import styled from 'styled-components';

interface ILayout {
  children: JSX.Element;
}

export default function Layout({ children }: ILayout) {
  return (
    <>
      <Navigation />
      <Wrapper>{children}</Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  background-color: ${({ theme: { color } }) => color.background};
`;
