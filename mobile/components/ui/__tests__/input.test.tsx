import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Input from '@/components/ui/input';

describe('Input', () => {
  it('should render label when provided', () => {
    render(<Input label="Correo electrónico" />);
    expect(screen.getByText('Correo electrónico')).toBeTruthy();
  });

  it('should render without label', () => {
    render(<Input testID="input" />);
    expect(screen.getByTestId('input')).toBeTruthy();
  });

  it('should show error text when error prop is set', () => {
    render(<Input error="Campo obligatorio" />);
    expect(screen.getByText('Campo obligatorio')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const onChangeText = vi.fn();
    render(<Input testID="input" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByTestId('input'), 'nuevo valor');
    expect(onChangeText).toHaveBeenCalledWith('nuevo valor');
  });

  it('should not show error when no error prop', () => {
    render(<Input label="Nombre" />);
    expect(screen.getByText('Nombre')).toBeTruthy();
    expect(screen.queryByText('Campo obligatorio')).toBeNull();
  });
});
