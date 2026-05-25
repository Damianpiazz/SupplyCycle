import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ErrorMessage from '@/components/ui/error-message';

describe('ErrorMessage', () => {
  it('should render error message text', () => {
    render(<ErrorMessage message="Ocurrió un error" />);
    expect(screen.getByText('Ocurrió un error')).toBeTruthy();
  });

  it('should show retry button when onRetry is provided', () => {
    render(<ErrorMessage message="Error" onRetry={() => {}} />);
    expect(screen.getByText('Reintentar')).toBeTruthy();
  });

  it('should call onRetry when retry button is pressed', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);
    const retryText = screen.getByText('Reintentar');
    fireEvent.press(retryText.parent!);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render without retry button', () => {
    render(<ErrorMessage message="Error sin reintento" />);
    expect(screen.getByText('Error sin reintento')).toBeTruthy();
    expect(screen.queryByText('Reintentar')).toBeNull();
  });
});
