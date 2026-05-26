import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react-native';
import ConnectivityBanner from '../connectivity-banner';

describe('ConnectivityBanner', () => {
  it('no renderiza nada cuando está online', () => {
    const { queryByText } = render(
      <ConnectivityBanner isConnected={true} />,
    );
    expect(queryByText(/conexión/i)).toBeNull();
  });

  it('renderiza banner offline cuando no hay conexión', () => {
    const { getByText } = render(<ConnectivityBanner isConnected={false} />);
    expect(getByText(/sin conexión/i)).toBeTruthy();
  });
});
