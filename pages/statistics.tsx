import React from 'react';

export default function Statistics() {
  return <div>statistics</div>;
}

import Layout from '@/components/Layout';
Statistics.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
