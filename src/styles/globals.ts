export const globalStyles = `
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #04050d;
    color: #ffffff;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }

  #root {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 600px) {
    #root {
      max-width: 560px;
      margin: 0 auto;
    }
  }

  ::-webkit-scrollbar {
    width: 0px;
  }

  .car-float {
    animation: carFloat 4s ease-in-out infinite;
  }

  @keyframes carFloat {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }
`
