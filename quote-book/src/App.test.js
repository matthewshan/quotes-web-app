import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import NavBar from './Nav/NavBar.jsx'

test('NavBar Email', () => {
  const { getByText } = render(<NavBar user={{email: 'joedoe@gmail.com'}} />);
  const linkElement = getByText(/joedoe@gmail.com/i);

  expect(linkElement).toBeInTheDocument();
});
