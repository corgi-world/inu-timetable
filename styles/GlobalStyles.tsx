import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
  ${reset}
  body {
    font-family: 'Nanum Gothic', sans-serif;
  }
  * {
    box-sizing:border-box;
    outline:none;
    border:none;
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
 }
 a {
   color: black;
   text-decoration: none;
 }
 button {
   background-color: transparent;
  cursor: pointer;
 }
`;

export default GlobalStyles;
