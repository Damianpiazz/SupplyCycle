import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react-native';
import Header from '@/components/ui/header';

describe('Header', () => {
  it('should render default title SupplyCycle', () => {
    render(<Header />);
    expect(screen.getByText('SupplyCycle')).toBeTruthy();
  });

  it('should render custom title', () => {
    render(<Header title="Mi Título" />);
    expect(screen.getByText('Mi Título')).toBeTruthy();
    expect(screen.queryByText('SupplyCycle')).toBeNull();
  });
});
