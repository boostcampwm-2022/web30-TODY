import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import App from './App';

test('renders learn react link', () => {
  render(
    <RecoilRoot>
      <App />
    </RecoilRoot>,
  );
});
