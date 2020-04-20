import React from 'react';
import { render } from '@testing-library/react';
import NavBar from './Nav/NavBar.jsx'
import QuoteCard from './Quotes/QuoteCard.jsx'
import GroupsView from './GroupsView/GroupsView.jsx';

// NOTE: My app is backend heavy, so there weren't many react tests that
// I could work with.

test('NavBar Email', () => {
  const { getByText } = render(<NavBar user={{email: 'joedoe@gmail.com'}} />);
  const linkElement = getByText(/joedoe@gmail.com/i);

  expect(linkElement).toBeInTheDocument();
});

test('QuoteCard test', () => {
  const { getByText } = render(<QuoteCard quote={{quote: "This is my quote", person: "This person"}} />)
  getByText("This is my quote")
  getByText("~This person")
})

test('GroupsView loading', () => {
  const { getByText } = render(<GroupsView />)
  getByText("Loading")
}) 