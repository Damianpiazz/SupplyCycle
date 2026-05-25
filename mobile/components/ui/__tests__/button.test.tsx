import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Button from '@/components/ui/button';

describe('Button', () => {
  it('should render title text', () => {
    render(<Button title="Presionar" />);
    expect(screen.getByText('Presionar')).toBeTruthy();
  });

  it('should show loading text when loading is true', () => {
    render(<Button title="Presionar" loading />);
    expect(screen.getByText('Cargando...')).toBeTruthy();
    expect(screen.queryByText('Presionar')).toBeNull();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button title="Presionar" disabled testID="btn" />);
    expect(screen.getByTestId('btn').props.disabled).toBe(true);
  });

  it('should call onPress when pressed', () => {
    const onPress = vi.fn();
    render(<Button title="Presionar" onPress={onPress} testID="btn" />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled via TouchableOpacity when disabled prop is true', () => {
    render(<Button title="Presionar" disabled testID="btn" />);
    expect(screen.getByTestId('btn').props.disabled).toBe(true);
  });

  it('should be disabled via TouchableOpacity when loading', () => {
    render(<Button title="Presionar" loading testID="btn" />);
    expect(screen.getByTestId('btn').props.disabled).toBe(true);
  });

  it('should show loading text when loading', () => {
    render(<Button title="Confirmar" loading />);
    expect(screen.getByText('Cargando...')).toBeTruthy();
    expect(screen.queryByText('Confirmar')).toBeNull();
  });
});
