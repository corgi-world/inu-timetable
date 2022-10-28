import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Signup from '@/pages/signup';
import theme from '@/styles/theme';

describe('Signup', () => {
  it('Signup UI Test', () => {
    render(
      <ThemeProvider theme={theme}>
        <Signup />
      </ThemeProvider>,
    );
    const signupButton = screen.getByRole('button', { name: '회원가입' });
    expect(signupButton).toBeDisabled();
  });

  it('Signup UI Test', () => {
    render(
      <ThemeProvider theme={theme}>
        <Signup />
      </ThemeProvider>,
    );
    const signinText = screen.getByText('로그인하기');
    expect(signinText).toBeInTheDocument();
  });
});
