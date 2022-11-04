import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import {
  MdHome,
  MdBarChart,
  MdOutlineManageAccounts,
  MdLogout,
} from 'react-icons/md';

export default function Navigation() {
  const handleSignout = () => {
    //
  };

  return (
    <Wrapper>
      <Nav>
        <IconsWrapper>
          <Link href='/'>
            <MdHome size='30' />
          </Link>
          <Link href='/statistics'>
            <MdBarChart size='30' />
          </Link>
        </IconsWrapper>
        <IconsWrapper>
          <Link href='/my'>
            <MdOutlineManageAccounts size='30' />
          </Link>
          <SignoutButton onClick={handleSignout}>
            <MdLogout size='30' />
          </SignoutButton>
        </IconsWrapper>
      </Nav>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: sticky;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid lightgray;
  background-color: white;
`;

const Nav = styled.nav`
  width: 975px;
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
`;

const IconsWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const SignoutButton = styled.button``;
