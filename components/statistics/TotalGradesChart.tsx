import React from 'react';

import type { IChartProps } from '@/types/statistics';

import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import type { ApexOptions } from 'apexcharts';

function TotalGradesChart({ categories, data }: IChartProps) {
  const xaxis = {
    ...options.xaxis,
    categories,
  };

  return (
    <ApexChart
      height={200}
      type='bar'
      series={[{ name: '', data }]}
      options={{ ...options, xaxis }}
    />
  );
}

export default React.memo(TotalGradesChart);

const options: ApexOptions = {
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: true,
    style: { colors: ['black'], fontSize: '15px' },
    formatter: (v: number) => v + '명',
  },
  xaxis: {
    labels: { show: false },
  },
  yaxis: {
    labels: { show: true, style: { fontSize: '14px' } },
  },
  tooltip: {
    marker: { show: false },
    y: {
      formatter: (v: number) => v + '명',
    },
  },
  colors: ['#ffaa00'],
  chart: {
    toolbar: {
      show: false,
    },
    fontFamily: 'Nanum Gothic',
  },
};
