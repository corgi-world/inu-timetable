import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import {
  MdHome,
  MdBarChart,
  MdOutlineManageAccounts,
  MdLogout,
} from 'react-icons/md';

export default function Navigation() {
  const router = useRouter();

  const handleSignout = async () => {
    await signOut({ redirect: false });
    router.push('/signin');
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
  width: 100%;
  top: 0;
  position: sticky;
  z-index: 999;
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
