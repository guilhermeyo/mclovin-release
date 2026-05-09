+++
title = "Manual"
template = "manual.html"

[extra]
toc_label = "Contents"
+++

## Why mclovin exists

mclovin started from three daily annoyances: Spotify links opening in the browser instead of the app, work repo links landing in the wrong Chrome profile, client Google Meet links opening where the work webcam was wired up. On macOS I solved it with [Finicky](https://github.com/johnste/finicky) and thought I was set. Then I moved to Linux and the problem came back — this time with no equivalent tool.

With AI to speed up the prototype, the first version was working in a few minutes and fixed my own setup. Solving it just for me felt small. I spent more time polishing it into something anyone hitting the same wall can use.

The mission is to cover all three desktop systems (Linux is here, macOS lands in `0.2`, Windows in `0.3`) and, along the way, expose what operating systems and browsers have been failing to do for too long. You click a link and it opens in the right place. No "which Chrome profile was that again", no closing the wrong window, no two-minute detour for every link.

## Install

Linux x86_64 for now. macOS and Windows coming in the next releases.

```bash
curl -fsSL https://mclovin.org/install.sh | bash
```

The script downloads the binary into `~/.local/bin/mclovin`, verifies its `sha256`, and exits. `~/.local/bin` is on `$PATH` by default on every modern distro.

Confirm:

```bash
mclovin --version
```

## Quickstart

Three commands and you're up:

```bash
mclovin config init    # creates ~/.config/mclovin/rules.toml
mclovin setup          # registers mclovin as the system default browser
mclovin doctor         # diagnoses the install
```

If mclovin is not registered as default, **none of the routing runs** — every link still goes to the previous handler. `mclovin doctor` tells you exactly what is missing.

To revert: `mclovin unsetup`.

A first rule example in `rules.toml`:

```toml
fallback_browser = "brave"

[[handler]]
match = "github.com"
browser = "brave"
description = "GitHub on Brave"
```

Saved? Click any `github.com` link and it opens in Brave. Anything else falls back to `fallback_browser` (also Brave here) or pops the picker if no rule matches.

## How it works

```
[user clicks a link]
        ↓
[OS hands the http/https URL to mclovin]
        ↓
[mclovin reads ~/.config/mclovin/rules.toml]
        ↓
   ┌──────────────────────┐
   │ does any rule match? │
   └──────────────────────┘
       yes ↓                 no ↓
[launch browser/command]   [picker asks]
```

mclovin is a single Rust binary with three frontends sharing the same core: CLI (scripts), TUI (`mclovin menu` in the terminal), and GUI (`mclovin settings`). Rules behave the same in any frontend because they live on disk in `rules.toml`.

## Configuring rules

The file is `~/.config/mclovin/rules.toml`. Each `[[handler]]` is one match → action rule.

### Match types

```toml
# Substring (most common)
[[handler]]
match = "github.com"
browser = "brave"

# List of domains — any of them matches
[[handler]]
match = ["wa.me", "web.whatsapp.com", "api.whatsapp.com"]
command = "zapzap"

# Regex (full control)
[[handler]]
match_regex = '^https?://open\.spotify\.com/'
command = "spotify --uri={url}"
```

### Browser vs command

```toml
# Detected browser (mclovin finds the .desktop and launches it)
browser = "brave"

# Browser with a specific profile
browser = { name = "chrome", profile = "Work" }

# Raw shell command (use {url} to insert the URL)
command = "firefox --new-window {url}"
```

### URL rewrite

Combined with regex, you can transform the URL before passing it on:

```toml
[[handler]]
match_regex = '^https?://open\.spotify\.com/(\w+)/([^?#/]+)'
rewrite = "spotify --uri=spotify:{1}:{2}"
description = "Spotify desktop"
```

`{1}` and `{2}` are the regex capture groups.

### Fallback and picker

```toml
# When no rule matches
fallback_browser = "brave"

[picker]
enabled = true
# command = "tui"   # optional: open the picker as a TUI window (alacritty)
                    # default: iced GUI picker
```

Want **every** unmatched URL to open straight in Brave (no picker)? Add a catch-all rule:

```toml
[[handler]]
match_regex = '.*'
browser = "brave"
```

Run `mclovin examples` for more copy-paste recipes.

## Frontends

mclovin has three interfaces sharing the same core:

| Interface | How to open | When to use |
|---|---|---|
| **GUI Settings** | `mclovin settings` or Walker → "mclovin Settings" | Mouse + keyboard, menu navigation |
| **TUI Menu** | `mclovin menu` in a terminal | When you're already in a terminal and prefer ratatui |
| **Picker** | Pops up when you click an unmatched link (Ctrl+Shift+B on Hyprland) | Quick browser pick per URL |

### Shortcuts

In both GUI and TUI:

| Shortcut | What it does |
|---|---|
| `↑` / `↓` or `k` / `j` | Navigate |
| `Enter` | Activate / open |
| `Esc` or `q` | Back / cancel |
| `Ctrl+,` | From the picker into Settings |
| `Ctrl+D` | Jump straight to the "Default browser" screen |
| `Ctrl+U` | Jump straight to the "Updates" screen |

## Auto-updates

mclovin checks for new versions in the background every 2 hours, against the [`mclovin-release`](https://github.com/guilhermeyo/mclovin-release/releases) repo. To turn it off: set `auto_update_check = false` in `~/.config/mclovin/preferences.toml`.

To force a check, open **Updates** and click "Check for updates". The button is debounced 10 seconds between consecutive clicks to avoid hammering the GitHub API.

When a new version is available:

1. The screen shows `current version → new version` in yellow
2. Clicking "Install now" downloads the binary, verifies the `sha256`, and installs
3. A countdown shows `Restarting in 5… 4… 3… 2… 1…`
4. mclovin restarts itself into the new version, landing back on the same screen you were on

If you reached Updates via `Ctrl+U` from the picker, mclovin remembers that across the restart and bounces you back to the picker when you press Esc on Updates.

## CLI reference

Every command honors `--quiet` (suppress non-essential output) and `--json` (machine-readable output where applicable).

| Command | What it does |
|---|---|
| `mclovin setup` | Register mclovin as the system default browser |
| `mclovin unsetup` | Revert the registration |
| `mclovin doctor` | Diagnose the install (handler, binary, .desktop) |
| `mclovin match URL` | Show which rule would match a URL (without opening) |
| `mclovin status` | Usage stats |
| `mclovin config init` | Create the initial `rules.toml` |
| `mclovin examples` | Print copy-paste rules.toml recipes |
| `mclovin lang [LANG]` | Show or change the UI language (`en`, `pt-BR`, `es-ES`) |
| `mclovin log [-f]` | Show (or follow) today's log |
| `mclovin list-browsers` | List browsers detected on the system |
| `mclovin rules list` | List rules from `rules.toml` |
| `mclovin rules add ...` | Add a rule from the CLI |
| `mclovin rules delete ...` | Remove a rule |
| `mclovin default-browser` | Inspect or change the system default browser |
| `mclovin fallback-browser` | Inspect or change the `fallback_browser` |
| `mclovin menu` | Open the TUI menu |
| `mclovin settings` | Open the settings GUI |
| `mclovin update` | Check and install updates |
| `mclovin --app=URL` | Open a URL as a webapp (chromeless window) |

`mclovin --help` lists everything. `mclovin <command> --help` shows per-command details.

## Troubleshooting

### Where things live

| File | What |
|---|---|
| `~/.config/mclovin/rules.toml` | Routing rules |
| `~/.config/mclovin/preferences.toml` | Language, auto-update |
| `~/.cache/mclovin/log.YYYY-MM-DD` | Daily log |
| `~/.cache/mclovin/update_check.toml` | Update-check cache |
| `~/.local/bin/mclovin` | Canonical binary |
| `~/.local/share/applications/mclovin.desktop` | MIME entry for `http` / `https` |

### Diagnose

```bash
mclovin doctor          # full check
mclovin log -f          # follow today's log live
mclovin --version       # the binary on $PATH
mclovin match https://github.com/foo/bar    # which rule would match
```

### "Wrong version" after an update

You may have two binaries on the system (`~/.local/bin/mclovin` and `~/.cargo/bin/mclovin` if you installed via `cargo install` previously). `setup` points everything at the canonical `~/.local/bin/` path, but it's worth checking:

```bash
which -a mclovin
ls -la ~/.local/bin/mclovin ~/.cargo/bin/mclovin 2>/dev/null
```

If you have two, copy the newer one over the older:

```bash
install -m 755 ~/.local/bin/mclovin ~/.cargo/bin/mclovin
```

### Reset the update-check cache

```bash
rm ~/.cache/mclovin/update_check.toml
```

Next launch, mclovin re-queries the public release.
