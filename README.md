# mclovin

A cross-platform URL router with three ways to drive it: a settings
GUI, a terminal TUI, and a scriptable CLI.

*Open every link in the right browser, profile, or app — driven by
TOML rules you control (with optional Lua snippets for dynamic
logic).*

This repo hosts the prebuilt release binaries. Source code is private
during alpha (contact the author for access).

## What it does

mclovin registers as the system default `http`/`https` handler. When
you click a link in Slack, your terminal, or any other app, the OS
hands the URL to mclovin. mclovin reads `rules.toml`, picks the right
browser (or any shell command), launches it, and gets out of the way.
If no rule matches, the built-in picker lets you pick one — same UX
as Walker / fuzzel.

| Frontend | When to reach for it | Command |
|---|---|---|
| **CLI** | scripting, Hyprland keybinds, automations | `mclovin rules add ...`, `mclovin status --json` |
| **TUI** | terminal users who like ratatui menus | `mclovin menu` (alias `mclovin tui`) |
| **GUI** | mouse + keyboard, settings UI | `mclovin settings` (alias `mclovin gui`) |

## Install (Linux x86_64)

The project is in alpha, so releases are tagged as pre-releases. The
one-liner pins to the latest published tag:

```bash
TAG=$(curl -s https://api.github.com/repos/guilhermeyo/mclovin-release/releases \
  | grep -m1 '"tag_name"' | cut -d'"' -f4)
mkdir -p ~/.local/bin
curl -L "https://github.com/guilhermeyo/mclovin-release/releases/download/$TAG/mclovin-linux-x86_64" -o ~/.local/bin/mclovin
chmod +x ~/.local/bin/mclovin
~/.local/bin/mclovin setup
```

The binary lives in `~/.local/bin/` so future updates from inside the
app work without sudo. Make sure `~/.local/bin/` is on your `$PATH` —
most modern distros do this automatically; if `mclovin --version`
doesn't work after install, add `export PATH="$HOME/.local/bin:$PATH"`
to your shell profile.

`mclovin setup` registers mclovin as your default `http`/`https`
handler. Click any link from then on and it gets routed by your rules.

Once 1.0 ships, the API hop will be replaced with the simpler
`/releases/latest/download/...` URL.

## Verify integrity

Each release ships a SHA-256 next to the binary:

```bash
curl -LO "https://github.com/guilhermeyo/mclovin-release/releases/download/$TAG/mclovin-linux-x86_64.sha256"
sha256sum -c mclovin-linux-x86_64.sha256
```

Expect `mclovin-linux-x86_64: OK`.

## Configuration

Rules live at `~/.config/mclovin/rules.toml`. Most rules are simple
match → command pairs:

```toml
default = "brave"  # fallback when nothing matches

[[handler]]
match = "github.com"
command = "brave {url}"
description = "GitHub on Brave"

[[handler]]
match = ["wa.me", "web.whatsapp.com", "api.whatsapp.com"]
command = "zapzap"
description = "WhatsApp via ZapZap"

[[handler]]
match_regex = '^https?://open\.spotify\.com/(\w+)/([^?#/]+)'
rewrite = "spotify --uri=spotify:{1}:{2}"
description = "Spotify desktop"
```

Match by **substring** (`match = "..."`), **list** (`match = ["a", "b"]`),
or **regex** (`match_regex = "..."`). The `command` is a shell line —
`{url}` is the URL, `{1}`, `{2}` are regex capture groups.

For dynamic rules (time-of-day routing, source-app awareness, computed
rewrites), drop a Lua snippet inline inside the same `rules.toml` via
`match_lua` / `rewrite_lua`. Snippets run in a sandboxed Lua 5.4 VM.
There's no separate `config.lua` — everything stays in TOML.

`mclovin examples` prints copy-paste recipes for common patterns.

## Quick tour

After `mclovin setup`:

- `mclovin settings` — graphical settings (rules, browsers, doctor, updates)
- `mclovin menu` — same thing in your terminal (TUI)
- `mclovin doctor` — diagnoses install state
- `mclovin examples` — copy-paste recipes for `rules.toml`
- `mclovin <url>` — route a URL manually (what your WM keybinds call)

Open the config with `mclovin settings` → Rules, or edit
`~/.config/mclovin/rules.toml` directly.

## Updates

mclovin checks for new releases in the background (every 2h) and shows
a badge in the footer when one is ready. Open the **Updates** screen
(in either `mclovin settings` or `mclovin menu`) to:

- See the current version and last check timestamp
- **Check for updates** — query the server on demand
- **Install now** — replace the running binary in place (no sudo)
- Toggle automatic checks on/off

Because the install path is `~/.local/bin/mclovin`, in-app updates
never need sudo.

## Platform support

- **Linux x86_64** — supported (Hyprland-tuned, but works under any
  freedesktop-compliant WM)
- **macOS** — handler scaffold present, not yet shipping binaries
- **Windows** — handler scaffold present, not yet shipping binaries

## Bug reports & feature requests

Open an [issue](https://github.com/guilhermeyo/mclovin-release/issues).
Triage happens against the private source repo; fixes ship in a new
release here.

## License

[MIT](LICENSE).
