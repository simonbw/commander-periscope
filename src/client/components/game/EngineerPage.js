import React from 'react';

const EngineerPage = ({ game }) => (
  <div id="engineer-page">
    Engineer Page
    <pre>{JSON.stringify(game, null, 2)}</pre>
  </div>
);

export default EngineerPage;