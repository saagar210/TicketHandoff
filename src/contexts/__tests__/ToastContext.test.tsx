import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import { ToastProvider, ToastContext } from '../ToastContext';

function TestComponent() {
  const context = useContext(ToastContext);

  if (!context) {
    return <div>No context</div>;
  }

  const { showToast, showConfirm } = context;

  return (
    <div>
      <button onClick={() => showToast('Test message', 'success')}>Show Success</button>
      <button onClick={() => showToast('Error message', 'error')}>Show Error</button>
      <button onClick={async () => {
        const result = await showConfirm('Are you sure?');
        document.body.setAttribute('data-confirm-result', String(result));
      }}>
        Show Confirm
      </button>
    </div>
  );
}

describe('ToastContext', () => {
  it('provides toast context to children', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByText('Show Success')).toBeInTheDocument();
  });

  it('shows toast notification when showToast is called', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success'));

    expect(await screen.findByText('Test message')).toBeInTheDocument();
  });

  it('shows multiple toasts simultaneously', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success'));
    await user.click(screen.getByText('Show Error'));

    expect(await screen.findByText('Test message')).toBeInTheDocument();
    expect(await screen.findByText('Error message')).toBeInTheDocument();
  });

  it('dismisses toast when close button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success'));
    expect(await screen.findByText('Test message')).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button');
    const toastCloseButton = closeButtons.find(btn => btn.getAttribute('class')?.includes('text-green'));

    if (toastCloseButton) {
      await user.click(toastCloseButton);
    }

    await waitFor(() => {
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });

  it('shows confirmation dialog with showConfirm', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Confirm'));

    expect(await screen.findByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('resolves with true when confirm button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Confirm'));
    await user.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(document.body.getAttribute('data-confirm-result')).toBe('true');
    });
  });

  it('resolves with false when cancel button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Confirm'));
    await user.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(document.body.getAttribute('data-confirm-result')).toBe('false');
    });
  });
});
