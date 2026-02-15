import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConfidenceBadge from '../ConfidenceBadge';

describe('ConfidenceBadge', () => {
  it('renders high confidence with green styling', () => {
    render(<ConfidenceBadge level="High" reason="Test reason" />);

    const badge = screen.getByText(/Confidence: High/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('green');
  });

  it('renders medium confidence with yellow styling', () => {
    render(<ConfidenceBadge level="Medium" reason="Test reason" />);

    const badge = screen.getByText(/Confidence: Medium/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('yellow');
  });

  it('renders low confidence with red styling', () => {
    render(<ConfidenceBadge level="Low" reason="Test reason" />);

    const badge = screen.getByText(/Confidence: Low/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('red');
  });

  it('displays confidence reason in title attribute', () => {
    const { container } = render(<ConfidenceBadge level="High" reason="Based on 5 items" />);

    const elementWithTitle = container.querySelector('[title="Based on 5 items"]');
    expect(elementWithTitle).toBeInTheDocument();
  });
});
