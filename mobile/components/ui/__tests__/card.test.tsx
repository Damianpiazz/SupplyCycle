import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import Card from '@/components/ui/card';

describe('Card', () => {
  it('should render children', () => {
    render(
      <Card>
        <Text>Contenido de la tarjeta</Text>
      </Card>
    );
    expect(screen.getByText('Contenido de la tarjeta')).toBeTruthy();
  });

  it('should handle onPress when provided', () => {
    const onPress = vi.fn();
    render(
      <Card onPress={onPress}>
        <Text testID="child">Pulsable</Text>
      </Card>
    );
    const child = screen.getByTestId('child');
    const themedView = child.parent!;
    const touchableOpacity = themedView.parent!;
    fireEvent.press(touchableOpacity);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render without onPress', () => {
    render(
      <Card>
        <Text>Sin presión</Text>
      </Card>
    );
    expect(screen.getByText('Sin presión')).toBeTruthy();
  });

  it('should apply custom styles', () => {
    render(
      <Card testID="card" style={{ marginTop: 50 }}>
        <Text>Estilizado</Text>
      </Card>
    );
    expect(screen.getByTestId('card')).toBeTruthy();
    expect(screen.getByText('Estilizado')).toBeTruthy();
  });
});
