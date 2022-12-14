export interface typeSize {
  desktop: string;
}
export interface typeColor {
  text: string;
  background: string;
}

import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme {
    size: typeSize;
    color: typeColor;
  }
}
