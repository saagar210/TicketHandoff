import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatDate, formatListDate, formatDetailDate, formatRelativeTime } from '../dateFormat';

describe('dateFormat utilities', () => {
  describe('formatDate', () => {
    it('formats date without year by default', () => {
      const result = formatDate('2025-01-15T10:30:00Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).not.toContain('2025');
    });

    it('formats date with year when requested', () => {
      const result = formatDate('2025-01-15T10:30:00Z', true);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });

    it('handles invalid date strings', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid date');
    });
  });

  describe('formatListDate', () => {
    it('formats date without year', () => {
      const result = formatListDate('2025-01-15T10:30:00Z');
      expect(result).toContain('Jan');
      expect(result).not.toContain('2025');
    });
  });

  describe('formatDetailDate', () => {
    it('formats date with year', () => {
      const result = formatDetailDate('2025-01-15T10:30:00Z');
      expect(result).toContain('Jan');
      expect(result).toContain('2025');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-02-14T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "just now" for recent times', () => {
      const result = formatRelativeTime('2025-02-14T11:59:30Z');
      expect(result).toBe('just now');
    });

    it('returns minutes ago for times within an hour', () => {
      const result = formatRelativeTime('2025-02-14T11:45:00Z');
      expect(result).toBe('15 minutes ago');
    });

    it('returns singular "minute" for 1 minute', () => {
      const result = formatRelativeTime('2025-02-14T11:59:00Z');
      expect(result).toBe('1 minute ago');
    });

    it('returns hours ago for times within a day', () => {
      const result = formatRelativeTime('2025-02-14T10:00:00Z');
      expect(result).toBe('2 hours ago');
    });

    it('returns singular "hour" for 1 hour', () => {
      const result = formatRelativeTime('2025-02-14T11:00:00Z');
      expect(result).toBe('1 hour ago');
    });

    it('returns "yesterday" for previous day', () => {
      const result = formatRelativeTime('2025-02-13T12:00:00Z');
      expect(result).toBe('yesterday');
    });

    it('returns days ago for times within a week', () => {
      const result = formatRelativeTime('2025-02-11T12:00:00Z');
      expect(result).toBe('3 days ago');
    });

    it('returns formatted date for times older than a week', () => {
      const result = formatRelativeTime('2025-01-15T12:00:00Z');
      expect(result).toContain('Jan');
      expect(result).toContain('2025');
    });
  });
});
