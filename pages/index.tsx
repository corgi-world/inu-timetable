import React from 'react';

export default function Home() {
  return <div>index</div>;
}

import Layout from '@/components/Layout';
Home.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

// import { redirectNotAuthUser } from '@/utils/auth';
// import { NextPageContext } from 'next';

// export async function getServerSideProps(context: NextPageContext) {
//   const returnObject = await redirectNotAuthUser(context.req);
//   return returnObject;
// }
