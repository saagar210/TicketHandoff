# Ticket Handoff Assistant

> **Turn 30-minute escalations into 3-minute handoffs.**

A secure, privacy-first desktop app that helps IT support engineers create professional ticket escalations with AI-powered summaries, structured checklists, and one-click Jira integration.

---

## Why Use This?

### The Problem
You're an L1 support engineer who needs to escalate a ticket to L2. You've spent 30 minutes troubleshooting, but now you need to:
- Reconstruct what you tried from memory
- Format it nicely for the next team
- Copy/paste ticket details manually
- Hope you didn't forget anything critical

**Result:** 10-15 minutes writing notes + follow-up questions from L2 because something was unclear.

### The Solution
Ticket Handoff Assistant **automates the busywork** so you can focus on solving problems:

✅ **Fetch ticket context automatically** from Jira (summary, reporter, current status)
✅ **Track troubleshooting as you go** with interactive checklists
✅ **Generate AI summaries** of what worked/didn't work (optional, runs locally)
✅ **Post formatted notes to Jira** in one click with markdown formatting
✅ **Save drafts** and resume later if you get interrupted
✅ **Attach files** directly to Jira tickets

**Time savings:** 9 minutes per escalation, 50% fewer clarifying questions from L2.

---

## What You Would Use It For

### Perfect For
- **L1 → L2 escalations** - Handoff tickets with complete context
- **Internal handoffs** - Pass tickets between shifts with clarity
- **Incident documentation** - Track troubleshooting steps in real-time
- **Knowledge building** - Review past escalations to find patterns
- **Training new hires** - Show examples of good escalation notes

### Common Workflows

**Scenario 1: Quick Escalation (3 minutes)**
```
1. Enter ticket ID → App fetches context from Jira
2. Select "General Troubleshooting" template
3. Check off steps you tried: ✓ Cleared cache, ✓ Restarted service
4. Click "Generate Summary" → AI writes: "Attempted standard troubleshooting..."
5. Click "Post to Ticket" → Done ✅
```

**Scenario 2: Build As You Go (30 seconds per step)**
```
While troubleshooting:
- Try something → Add to checklist → Check if it worked
- Get interrupted → Hit Cmd+S to save draft
- Resume later → Pick up exactly where you left off
- Escalate when stuck → Summary is already written
```

**Scenario 3: Attach Evidence**
```
1. Create escalation with checklist
2. Attach screenshot of error, log file, config dump
3. Post → Files upload to Jira automatically
```

---

## How to Use It

### Installation

**Prerequisites:**
- macOS 10.15+ (Windows/Linux coming soon)
- [Jira Cloud](https://www.atlassian.com/software/jira) account with API access
- (Optional) [Ollama](https://ollama.com) for AI summaries

**Install:**
```bash
# Clone the repo
git clone https://github.com/samueladad75-byte/TicketHandoff.git
cd TicketHandoff

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Run in low-disk lean development mode
npm run lean:dev

# Build production app (creates .dmg installer)
npm run tauri build
```

### Normal Dev vs Lean Dev

- `npm run tauri dev`: fastest repeat startup, but keeps Rust and Vite build artifacts in the repo (`src-tauri/target`, `node_modules/.vite`).
- `npm run lean:dev`: routes Rust/Vite build caches to a temporary directory and removes heavy local build artifacts when the dev session exits.
- Tradeoff: lean mode saves disk space aggressively, but each new session will usually compile more and start slower.

### First-Time Setup

#### 1. Configure Jira Integration
1. Open **Settings** page in the app
2. Generate a Jira API token: https://id.atlassian.com/manage-profile/security/api-tokens
3. Enter your details:
   - **Jira Base URL:** `https://yourcompany.atlassian.net`
   - **Email:** your-email@company.com
   - **API Token:** (paste token)
4. Click **Test Connection** to verify

**Security:** Credentials are stored in macOS Keychain (not the app database), so they're encrypted by the OS.

#### 2. Set Up AI Summaries (Optional)
```bash
# Install Ollama (macOS)
brew install ollama

# Download a model (llama3 recommended, ~4GB)
ollama pull llama3

# Start Ollama server (runs in background)
ollama serve
```

Then in app Settings:
- **Ollama Endpoint:** `http://localhost:11434` (default)
- **Model:** `llama3`

Click **Test Ollama Connection** to verify.

**Note:** AI is optional. You can create escalations without it—just skip the "Generate Summary" step.

---

## Features

### Core Functionality
- ✅ **Template-based escalations** - Pre-built checklists for common scenarios
- ✅ **Jira auto-population** - Fetch ticket summary, reporter, status automatically
- ✅ **AI-powered summaries** - Generate structured summaries with confidence scores
- ✅ **File attachments** - Upload screenshots, logs, configs to Jira
- ✅ **One-click posting** - Formatted markdown notes posted directly to tickets
- ✅ **Draft management** - Save partial escalations and resume anytime
- ✅ **Audit logging** - Track all escalation activity for compliance
- ✅ **Retry failed posts** - Network issues? Retry without re-creating

### User Experience
- ⌨️ **Keyboard shortcuts** - `Cmd+S` (save draft), `Cmd+Enter` (review), `Esc` (close)
- 📊 **Live markdown preview** - See exactly how your notes will look in Jira
- 🎨 **Smart loading states** - Clear feedback during API calls
- ⚠️ **Actionable errors** - "Check your API token in Settings" not "Error 401"
- 🔄 **Automatic retries** - Network timeouts retry with exponential backoff
- 📱 **Responsive design** - Works at any window size

### AI Features (When Ollama Enabled)
- **Structured summaries** - Automatic ✓ (worked) / ✗ (failed) / ? (unclear) formatting
- **Confidence scoring** - High/Medium/Low based on checklist completeness
- **Editable output** - AI is a suggestion, you have final say
- **Privacy-preserving** - Runs 100% locally, no data sent to cloud
- **Graceful degradation** - App works fine if Ollama is offline

---

## Tech Stack

**Frontend:**
- React 19 + TypeScript (strict mode)
- Tailwind CSS v4
- Vitest + React Testing Library (37 tests)

**Backend:**
- Rust 1.77+ with Tauri 2
- SQLite with r2d2 connection pooling
- Exponential backoff retry logic for API calls
- Streaming file uploads for large attachments

**Security:**
- macOS Keychain for credential storage (OS-level encryption)
- Content Security Policy (CSP) enabled
- No credentials in database or plaintext

**Integrations:**
- Jira Cloud REST API v3 (with ADF markdown conversion)
- Ollama local LLM API

---

## Usage Examples

### Example 1: Standard Escalation
```
Ticket: SUPPORT-1234 - "User can't access dashboard"

Your troubleshooting:
☑ Verified user permissions in admin panel
☑ Cleared browser cache and cookies
☑ Tested in incognito mode
☐ Checked server logs

Generated summary:
"Attempted standard browser troubleshooting (cache, incognito) with no
improvement. Verified user permissions are correct. Issue persists across
browsers suggesting backend problem. Requires server log review."

Posted to Jira in markdown format with checklist and summary.
Time: 2m 30s
```

### Example 2: Complex Multi-File Escalation
```
Ticket: SUPPORT-5678 - "API returning 500 errors"

Your troubleshooting:
☑ Captured error screenshot
☑ Downloaded server logs (large file)
☑ Exported recent API requests from monitoring tool
☑ Identified spike in traffic at error time

Actions:
1. Add checklist items as you investigate
2. Attach 3 files (screenshot, logs, export)
3. Generate summary: "Traffic spike coincided with errors..."
4. Review → Post → All files upload automatically

Time: 4 minutes (vs 15 minutes manual copy/paste/upload)
```

---

## Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd+S` / `Ctrl+S` | Save as draft | New Escalation page |
| `Cmd+Enter` / `Ctrl+Enter` | Open review modal | New Escalation page |
| `Esc` | Close modal | Any modal open |
| `Tab` | Next field | Form navigation |
| `Shift+Tab` | Previous field | Form navigation |
| `Enter` | Add checklist item | Checklist input focused |

See [KEYBOARD_SHORTCUTS.md](./KEYBOARD_SHORTCUTS.md) for complete reference.

---

## Project Structure

```
TicketHandoff/
├── src/                          # React frontend
│   ├── components/              # Reusable UI components
│   │   ├── Toast.tsx           # Notification system
│   │   ├── ReviewModal.tsx     # Pre-post review dialog
│   │   └── ChecklistUI.tsx     # Interactive checklists
│   ├── contexts/               # React Context providers
│   │   └── ToastContext.tsx   # Toast notification state
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Top-level page components
│   │   ├── NewEscalation.tsx  # Main escalation form
│   │   ├── History.tsx        # Past escalations list
│   │   └── Settings.tsx       # Configuration page
│   ├── utils/                  # Helper functions
│   │   └── dateFormat.ts      # Consistent date formatting
│   └── types.ts               # TypeScript type definitions
│
├── src-tauri/                   # Rust backend
│   ├── commands/               # Tauri command handlers (API layer)
│   │   ├── escalations.rs     # CRUD operations
│   │   ├── settings.rs        # Config management
│   │   └── templates.rs       # Template operations
│   ├── services/               # Business logic
│   │   ├── jira.rs            # Jira API client with retry logic
│   │   ├── ollama.rs          # Ollama LLM integration
│   │   ├── retry.rs           # Exponential backoff retry wrapper
│   │   └── adf.rs             # Markdown → Atlassian Document Format
│   ├── migrations/             # Database schema migrations
│   │   ├── 001_init.sql       # Initial schema
│   │   └── 002_security.sql   # Foreign keys + credential removal
│   ├── db.rs                  # SQLite connection pooling
│   ├── keychain.rs            # macOS Keychain wrapper
│   ├── error.rs               # Error types and handling
│   ├── models.rs              # Data structures
│   └── lib.rs                 # Application entry point
│
└── assets/templates/            # Pre-built escalation templates
```

---

## Troubleshooting

### "Could not fetch ticket from Jira"
**Symptoms:** Error when clicking "Fetch from Jira"
**Fixes:**
- Verify ticket ID format: `PROJECT-1234` (not just `1234`)
- Check Jira URL in Settings (must be `https://yourcompany.atlassian.net`)
- Regenerate API token if it expired: https://id.atlassian.com/manage-profile/security/api-tokens
- Click "Test Connection" in Settings to diagnose

### "Ollama not available"
**Symptoms:** Generate Summary button shows warning
**Fixes:**
- Start Ollama: `ollama serve` in terminal
- Verify model is installed: `ollama list` (should show `llama3`)
- Check endpoint in Settings: `http://localhost:11434`
- **You can still create escalations without AI** - just write summary manually

### "Failed to attach file to Jira"
**Symptoms:** Comment posts but file upload fails
**Fixes:**
- Check file size (must be < 100MB)
- Verify file path still exists (didn't move/delete it)
- Check Jira permissions (can you attach files in Jira web UI?)
- Large files may timeout on slow connections (try smaller file or better network)

### "Database initialization failed"
**Symptoms:** App won't start
**Fixes:**
- Check disk permissions: App needs write access to `~/Library/Application Support/com.tickethandoff.desktop/`
- Free up disk space if drive is full
- Restart app (connection pooling will retry)

### General Debugging
- Check **Activity Log** in History page for detailed error messages
- Enable debug logging: `RUST_LOG=debug npm run tauri dev`
- Report issues: https://github.com/samueladad75-byte/TicketHandoff/issues

---

## Development

### Dev Modes and Cleanup
```bash
# Standard local dev (faster warm restarts, higher disk use)
npm run tauri dev

# Lean local dev (lower disk use, slower cold starts)
npm run lean:dev

# Remove heavy build artifacts only (safe daily cleanup)
npm run clean:heavy

# Remove all reproducible local caches including dependencies
npm run clean:full
```

### Running Tests
```bash
# Frontend tests (Vitest)
npm test

# Frontend tests with UI
npm run test:ui

# Frontend test coverage
npm run test:coverage

# Backend tests (Rust)
cd src-tauri && cargo test
```

### Code Quality
```bash
# Lint frontend
npm run lint

# Format Rust code
cd src-tauri && cargo fmt

# Check Rust code
cd src-tauri && cargo clippy
```

### Building for Production
```bash
# Build optimized app bundle
npm run tauri build

# Output:
# - macOS: src-tauri/target/release/bundle/dmg/Ticket Handoff Assistant_*.dmg
# - Windows: src-tauri/target/release/bundle/msi/Ticket Handoff Assistant_*.msi
# - Linux: src-tauri/target/release/bundle/appimage/ticket-handoff_*.AppImage
```

---

## Roadmap

### Planned Features
- [ ] **Cross-platform support** - Windows and Linux builds
- [ ] **Activity log integration** - Pull recent Jira comments into checklists
- [ ] **Screenshot capture** - Built-in screenshot tool with annotation
- [ ] **PII redaction** - Automatic detection and redaction of sensitive data
- [ ] **Zendesk support** - Alternative to Jira for ticketing
- [ ] **Team analytics** - Track escalation patterns and response times
- [ ] **Dark mode** - Eye-friendly theme for late-night escalations
- [ ] **Custom templates** - User-defined checklists and formats
- [ ] **Multi-language LLM** - Support for non-English summaries

### Completed (v1.0)
- [x] Jira Cloud API integration
- [x] Ollama AI summarization
- [x] File attachment support
- [x] Draft management and history
- [x] macOS Keychain credential storage
- [x] Retry logic with exponential backoff
- [x] Toast notifications
- [x] Keyboard shortcuts
- [x] Comprehensive test suite (37 tests)

---

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for new functionality
4. Ensure all tests pass (`npm test && cd src-tauri && cargo test`)
5. Commit with conventional commits (`feat:`, `fix:`, `docs:`, etc.)
6. Push to your fork and submit a pull request

---

## License

See [LICENSE](./LICENSE) file.

---

## Acknowledgments

Built with:
- [Tauri](https://tauri.app/) - Desktop app framework
- [React](https://react.dev/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Ollama](https://ollama.com/) - Local LLM runtime
- [Jira Cloud API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/) - Ticket integration

---

## Support

- **Issues:** https://github.com/samueladad75-byte/TicketHandoff/issues
- **Discussions:** https://github.com/samueladad75-byte/TicketHandoff/discussions

---

**Made with ❤️ for support engineers who are tired of writing handoff notes.**
