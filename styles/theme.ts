import { typeSize, typeColor } from './styled';

const size: typeSize = {
  desktop: '1024px',
};

const color: typeColor = {
  text: 'black',
  background: '#fafafa',
};

import { DefaultTheme } from 'styled-components';
const theme: DefaultTheme = {
  size,
  color,
};

export default theme;
