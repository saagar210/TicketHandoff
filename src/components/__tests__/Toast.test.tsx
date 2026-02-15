import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../Toast';

describe('Toast', () => {
  it('renders success toast with correct styling', () => {
    const onDismiss = vi.fn();
    const { container } = render(<Toast message="Success!" type="success" onDismiss={onDismiss} />);

    expect(screen.getByText('Success!')).toBeInTheDocument();
    const toastDiv = container.querySelector('.bg-green-50');
    expect(toastDiv).toBeInTheDocument();
    expect(toastDiv?.className).toContain('border-green-200');
  });

  it('renders error toast with correct styling', () => {
    const onDismiss = vi.fn();
    const { container } = render(<Toast message="Error occurred" type="error" onDismiss={onDismiss} />);

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    const toastDiv = container.querySelector('.bg-red-50');
    expect(toastDiv).toBeInTheDocument();
    expect(toastDiv?.className).toContain('border-red-200');
  });

  it('renders warning toast', () => {
    const onDismiss = vi.fn();
    render(<Toast message="Warning!" type="warning" onDismiss={onDismiss} />);

    expect(screen.getByText('Warning!')).toBeInTheDocument();
  });

  it('renders info toast', () => {
    const onDismiss = vi.fn();
    render(<Toast message="Info message" type="info" onDismiss={onDismiss} />);

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('calls onDismiss when close button clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Toast message="Test" type="success" onDismiss={onDismiss} />);

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('auto-dismisses after timeout', async () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast message="Test" type="success" onDismiss={onDismiss} />);

    expect(onDismiss).not.toHaveBeenCalled();

    // Success toasts dismiss after 3 seconds
    vi.advanceTimersByTime(3000);

    expect(onDismiss).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('error toasts have longer timeout', async () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast message="Error" type="error" onDismiss={onDismiss} />);

    // Should not dismiss after 3 seconds
    vi.advanceTimersByTime(3000);
    expect(onDismiss).not.toHaveBeenCalled();

    // Should dismiss after 5 seconds
    vi.advanceTimersByTime(2000);
    expect(onDismiss).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
