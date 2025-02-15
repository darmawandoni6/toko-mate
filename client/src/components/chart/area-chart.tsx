import { FC } from 'react';

import { Chart, ChartWrapperOptions } from 'react-google-charts';

const options: ChartWrapperOptions['options'] = {
  legend: 'none',
  colors: ['#dc2626'],
  chartArea: { top: 20, right: 20, bottom: 30, left: 50, width: '100%' },
};
interface Props {
  data: (string | number)[][];
}
const AreaChart: FC<Props> = ({ data }) => {
  return <Chart className="m-auto" chartType="AreaChart" height="200px" data={data} options={options} />;
};

export default AreaChart;
