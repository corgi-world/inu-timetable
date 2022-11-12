import React from 'react';
import Navigation from './Navigation';

interface ILayout {
  children: JSX.Element;
}

export default function Layout({ children }: ILayout) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
