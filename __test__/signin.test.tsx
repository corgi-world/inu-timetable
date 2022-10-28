import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Signin from '@/pages/signin';
import theme from '@/styles/theme';

describe('Signin', () => {
  it('Signin UI Test', () => {
    render(
      <ThemeProvider theme={theme}>
        <Signin />
      </ThemeProvider>,
    );
    const signinButton = screen.getByRole('button', { name: '로그인' });
    expect(signinButton).toBeDisabled();
  });

  it('Signin UI Test', () => {
    render(
      <ThemeProvider theme={theme}>
        <Signin />
      </ThemeProvider>,
    );
    const signupText = screen.getByText('가입하기');
    expect(signupText).toBeInTheDocument();
  });
});
