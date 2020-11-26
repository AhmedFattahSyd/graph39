import React from 'react';
import { render } from '@testing-library/react';
import GraphApp from './GraphApp';

test('renders learn react link', () => {
  const { getByText } = render(<GraphApp />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
