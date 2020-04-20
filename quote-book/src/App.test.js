import React from 'react';
import { render } from '@testing-library/react';
import NavBar from './Nav/NavBar.jsx'
import QuoteCard from './'


test('NavBar Email', () => {
  const { getByText } = render(<NavBar user={{email: 'joedoe@gmail.com'}} />);
  const linkElement = getByText(/joedoe@gmail.com/i);

  expect(linkElement).toBeInTheDocument();
});

// test('QuoteCard test', () => {
//   const { getByText } = render(<QuoteCard quote={"This is my quote"} person={"This person"} />)
//   getByText("This is my Quote")
//   getByText("~This person")
// })