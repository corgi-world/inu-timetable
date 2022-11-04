import React from 'react';

export default function Mypage() {
  return <div>Mypage</div>;
}

import Layout from '@/components/Layout';
Mypage.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
