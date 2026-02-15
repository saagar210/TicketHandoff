# Keyboard Shortcuts

Ticket Handoff Assistant supports the following keyboard shortcuts for faster workflow.

## Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd+S` / `Ctrl+S` | Save as draft | New Escalation page |
| `Cmd+Enter` / `Ctrl+Enter` | Open review modal | New Escalation page |
| `Esc` | Close modal | Any modal open |

## New Escalation Page

### Form Navigation
- **Tab** - Move to next field
- **Shift+Tab** - Move to previous field

### Quick Actions
- **Cmd+S / Ctrl+S** - Save current escalation as draft
  - Saves all form data and checklist items
  - Can be resumed later from History page

- **Cmd+Enter / Ctrl+Enter** - Review and post
  - Opens the review modal with generated markdown preview
  - Requires at least ticket ID and problem summary

### Checklist Management
- **Enter** in checklist input - Add new item
- **Click checkbox** - Toggle completion status
- **Click × button** - Remove item

## History Page

### Escalation Actions
- **Click row** - Edit existing escalation
- **Click "Delete"** - Remove escalation (shows confirmation)
- **Click "Retry"** - Re-attempt failed Jira post

## Review Modal

| Shortcut | Action |
|----------|--------|
| `Esc` | Close modal without posting |
| `Enter` | Confirm and post to Jira |

## Tips

### Efficient Workflow
1. **Draft Early** - Hit `Cmd+S` frequently to save progress
2. **Quick Review** - Use `Cmd+Enter` to preview before posting
3. **Keyboard-First** - Navigate entire form without mouse using Tab

### Best Practices
- Save drafts before fetching Jira tickets (in case of network issues)
- Use AI summary generation after completing most checklist items
- Review markdown preview before posting to catch formatting issues

## Platform Differences

### macOS
- `Cmd` key used for all shortcuts
- Example: `Cmd+S` to save

### Windows/Linux
- `Ctrl` key used for all shortcuts
- Example: `Ctrl+S` to save

## Accessibility

All shortcuts are optional - every action can be performed with mouse/touch:
- Buttons clearly labeled
- Form fields accessible via Tab key
- Screen reader compatible

## Future Enhancements

Planned shortcuts (not yet implemented):
- `Cmd+K` - Quick command palette
- `Cmd+F` - Search history
- `Cmd+N` - New escalation from anywhere
- `Cmd+,` - Open settings

## Feedback

To request new keyboard shortcuts, create an issue at:
https://github.com/anthropics/claude-code/issues
