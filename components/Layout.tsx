import React from 'react';

interface ILayout {
  children: JSX.Element;
}

export default function Layout({ children }: ILayout) {
  return (
    <>
      <p>Hello Layout</p>
      {children}
    </>
  );
}
