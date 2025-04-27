import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background-color: #f9f9f9;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyle;
