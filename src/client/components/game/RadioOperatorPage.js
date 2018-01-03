import React from 'react';

const RadioOperatorPage = ({ game }) => (
  <div id="radio-operator-page">
    Radio Operator Page
    <pre>{JSON.stringify(game, null, 2)}</pre>
  </div>
);

export default RadioOperatorPage;