import React, { Component } from 'react';
import styled from 'styled-components';

import BarChart from './component/BarChart.js';

export default class App extends Component {
  render() {
    return (
      <AppContainer>
        <BackgroundMask />
        <ChartContainer>
          <h1>U.S. GDP</h1>
          <p>{'figures are in the billions'}</p>
          <BarChart />
        </ChartContainer>
      </AppContainer>
    );
  }
}


const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fafafa;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding: 20px 40px;

  h1 {
    margin-bottom: 0;
  }

  p {
    margin-top: 10px;
  }

  img {
    height: 50px;
    width: ${Math.round(1.9 * 50)}px;
  }
`;

const BackgroundMask = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #222;
  opacity: 0.8;
  z-index: -99;
`;
