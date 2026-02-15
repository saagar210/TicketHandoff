import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChecklistUI from '../ChecklistUI';
import type { ChecklistItem } from '../../types';

describe('ChecklistUI', () => {
  it('renders checklist items', () => {
    const items: ChecklistItem[] = [
      { text: 'Item 1', checked: false },
      { text: 'Item 2', checked: true },
    ];
    const onChange = vi.fn();

    render(<ChecklistUI items={items} onChange={onChange} />);

    expect(screen.getByDisplayValue('Item 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Item 2')).toBeInTheDocument();
  });

  it('displays label and add button', () => {
    const onChange = vi.fn();

    render(<ChecklistUI items={[]} onChange={onChange} />);

    expect(screen.getByText('Troubleshooting Steps')).toBeInTheDocument();
    expect(screen.getByText('+ Add step')).toBeInTheDocument();
  });

  it('toggles checkbox when clicked', async () => {
    const user = userEvent.setup();
    const items: ChecklistItem[] = [
      { text: 'Test item', checked: false },
    ];
    const onChange = vi.fn();

    render(<ChecklistUI items={items} onChange={onChange} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(onChange).toHaveBeenCalled();
    const newItems = onChange.mock.calls[0][0];
    expect(newItems[0].checked).toBe(true);
  });

  it('adds new item when Add button clicked', async () => {
    const user = userEvent.setup();
    const items: ChecklistItem[] = [];
    const onChange = vi.fn();

    render(<ChecklistUI items={items} onChange={onChange} />);

    const addButton = screen.getByText('+ Add step');
    await user.click(addButton);

    expect(onChange).toHaveBeenCalled();
    const newItems = onChange.mock.calls[0][0];
    expect(newItems).toHaveLength(1);
    expect(newItems[0].text).toBe('');
    expect(newItems[0].checked).toBe(false);
  });

  it('removes item when delete button clicked', async () => {
    const user = userEvent.setup();
    const items: ChecklistItem[] = [
      { text: 'Item to remove', checked: false },
    ];
    const onChange = vi.fn();

    render(<ChecklistUI items={items} onChange={onChange} />);

    const deleteButton = screen.getByLabelText('Remove item');
    await user.click(deleteButton);

    expect(onChange).toHaveBeenCalled();
    const newItems = onChange.mock.calls[0][0];
    expect(newItems).toHaveLength(0);
  });

  it('shows progress indicator', () => {
    const items: ChecklistItem[] = [
      { text: 'Item 1', checked: true },
      { text: 'Item 2', checked: true },
      { text: 'Item 3', checked: false },
    ];
    const onChange = vi.fn();

    render(<ChecklistUI items={items} onChange={onChange} />);

    expect(screen.getByText('2/3 completed')).toBeInTheDocument();
  });
});
