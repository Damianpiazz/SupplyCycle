import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import LoadingSpinner from '@/components/ui/loading-spinner';

describe('LoadingSpinner', () => {
  it('should render ActivityIndicator', () => {
    render(<LoadingSpinner />);
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('should show message when provided', () => {
    render(<LoadingSpinner message="Cargando datos..." />);
    expect(screen.getByText('Cargando datos...')).toBeTruthy();
  });

  it('should render without message', () => {
    render(<LoadingSpinner />);
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
