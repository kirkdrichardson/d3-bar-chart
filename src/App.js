import React, { Component } from 'react';
import styled from 'styled-components';

import BarChart from './component/BarChart.js';

export default class App extends Component {
  render() {
    return (
      <AppContainer>
        <ChartContainer>
          <h2>US GDP</h2>
          <BarChart />
        </ChartContainer>
      </AppContainer>
    );
  }
}


const AppContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartContainer = styled.div`
  padding: 20px 40px;
  background: gray;
`;
