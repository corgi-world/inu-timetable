import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Signup from '@/pages/signup';
import theme from '@/styles/theme';

const queryClient = new QueryClient();

describe('Signup', () => {
  it('Signup UI Test', () => {
    renderSignup();

    const signupButton = screen.getByRole('button', { name: '회원가입' });
    expect(signupButton).toBeDisabled();
  });

  it('Signup UI Test', () => {
    renderSignup();

    const signinText = screen.getByText('로그인하기');
    expect(signinText).toBeInTheDocument();
  });
});

function renderSignup() {
  return render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Signup />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}
