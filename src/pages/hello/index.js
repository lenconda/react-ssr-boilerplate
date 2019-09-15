import React from 'react';
import ReactDOM from 'react-dom';

const Hello = () => {
  return (
    <p className="it-works">
      This is the /hello page!
    </p>
  );
};

export default Hello;

ReactDOM.render(<Hello />, document.getElementById('root'));
