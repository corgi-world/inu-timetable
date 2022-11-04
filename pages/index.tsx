import React from 'react';

export default function Home() {
  return <div>index</div>;
}

import Layout from '@/components/Layout';
Home.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
