# Ticket Handoff Prep Assistant

A Tauri 2 desktop application that helps L1 support engineers create structured escalation notes for L2 teams in minutes instead of hours.

## Overview

The Ticket Handoff Assistant automates the tedious process of assembling handoff notes by:
- Auto-populating ticket data from Jira
- Providing structured templates with troubleshooting checklists
- Generating AI-powered summaries with Ollama (optional)
- Posting formatted escalations directly to Jira tickets
- Tracking escalation history and audit logs

**Time savings:** 9 minutes per escalation, 50% fewer clarifying questions from L2.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS v4
- **Backend:** Rust + Tauri 2
- **Database:** SQLite (local, no server required)
- **API Integration:** Jira Cloud REST API v3
- **LLM:** Ollama (local, privacy-preserving)
- **Security:** SQLite-based credential storage with OS file permissions

## Features

### Core Functionality
- ✅ Template-based escalation creation with pre-filled checklists
- ✅ Auto-populate from Jira tickets (summary, reporter, status)
- ✅ AI-powered troubleshooting summary with confidence scoring
- ✅ File attachment support (upload to Jira)
- ✅ One-click posting to Jira with markdown formatting
- ✅ Escalation history with status tracking (draft/posted/failed)
- ✅ Audit logging for compliance
- ✅ Retry failed posts with preserved data

### User Experience
- ⌨️ Keyboard shortcuts (Cmd/Ctrl+S, Cmd/Ctrl+Enter, Esc)
- 📊 Real-time markdown preview
- 🎨 Loading states for all async operations
- ⚠️ Contextual error messages with actionable guidance
- 🔄 Retry functionality for failed operations
- 📱 Responsive design

### AI Features (Optional)
- Structured LLM summaries with ✓/✗/? format
- Confidence scoring (High/Medium/Low) based on checklist completeness
- Editable AI output with human review
- Graceful fallback when Ollama unavailable

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Rust 1.77.2+ ([install via rustup](https://rustup.rs/))
- Jira Cloud account with API access
- Ollama (optional, for AI): [ollama.com](https://ollama.com)

### Installation

```bash
# Install dependencies
npm install

# Run in development
npm run tauri dev

# Build for production
npm run tauri build
```

### Configuration

1. **Jira Setup** (Settings page):
   - Generate API token: https://id.atlassian.com/manage-profile/security/api-tokens
   - Enter Jira Base URL (e.g., `https://company.atlassian.net`)
   - Enter email and API token
   - Click "Test Connection"

2. **Ollama Setup** (Optional):
   ```bash
   # Install Ollama
   brew install ollama  # macOS

   # Pull a model
   ollama pull llama3

   # Start server
   ollama serve
   ```

## Usage Workflows

### 1. Quick Manual Escalation
1. New Escalation → Enter ticket ID
2. Select template → Check troubleshooting steps
3. Preview & Review → Post to Ticket

### 2. Jira-Assisted with AI
1. Enter ticket ID → Fetch from Jira (auto-populates)
2. Complete checklist → Generate AI Summary
3. Review/edit summary → Post to Ticket

### 3. Save Draft & Resume
1. Create partial escalation → Save as Draft
2. History → Edit → Complete → Post

## Keyboard Shortcuts

- **Cmd/Ctrl + S** - Save draft
- **Cmd/Ctrl + Enter** - Preview & review
- **Esc** - Close modal

## Project Structure

```
TicketHandoff/
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── hooks/             # React hooks
│   ├── pages/             # Page components
│   └── types.ts           # TypeScript types
├── src-tauri/             # Rust backend
│   ├── commands/          # Tauri commands
│   ├── services/          # Business logic
│   ├── models.rs          # Data structures
│   └── db.rs              # SQLite operations
└── assets/templates/      # Seed templates
```

## Troubleshooting

**"Could not fetch ticket"**
- Verify ticket ID format (SUPPORT-1234)
- Check credentials in Settings

**"Ollama not running"**
- Start: `ollama serve`
- You can post without AI summary

**"Failed to attach file"**
- Check file size (< 100MB)
- Verify file path exists

## Roadmap

- [ ] Activity log integration
- [ ] Screenshot capture
- [ ] PII redaction
- [ ] Zendesk support
- [ ] Team analytics
- [ ] Dark mode

## License

See LICENSE file.

## Built With

- [Tauri](https://tauri.app/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Ollama](https://ollama.com/)
