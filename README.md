# mclovin

A cross-platform URL router driven by Lua rules. Set it as your system
default browser and let `rules.toml` decide where each link goes —
work URLs to one Brave profile, personal to another, Spotify links
straight into the Spotify app, etc.

This repo hosts the prebuilt release binaries. Source code is private
(contact the author for access).

## Install (Linux x86_64)

The project is in alpha, so releases are tagged as pre-releases.
Pin to the latest published tag (the one-liner does this for you):

```bash
TAG=$(curl -s https://api.github.com/repos/guilhermeyo/mclovin-release/releases \
  | grep -m1 '"tag_name"' | cut -d'"' -f4)
curl -L "https://github.com/guilhermeyo/mclovin-release/releases/download/$TAG/mclovin-linux-x86_64" -o mclovin
chmod +x mclovin
sudo install -m 755 mclovin /usr/local/bin/mclovin
mclovin setup
```

Once 1.0 ships, replace the API hop with the simpler
`/releases/latest/download/...` URL.

`mclovin setup` registers mclovin as your default `http`/`https`
handler. Click any link from then on and it gets routed by your
rules.

## Verify integrity

Each release ships a SHA-256 next to the binary:

```bash
curl -LO "https://github.com/guilhermeyo/mclovin-release/releases/download/$TAG/mclovin-linux-x86_64.sha256"
sha256sum -c mclovin-linux-x86_64.sha256
```

Expect `mclovin-linux-x86_64: OK`.

## Quick tour

After `mclovin setup`:

- `mclovin` — opens the interactive menu (rules, browsers, doctor)
- `mclovin doctor` — diagnoses install state
- `mclovin examples` — copy-paste recipes for `rules.toml`
- `mclovin <url>` — route a URL manually (what your WM keybinds call)

The config lives at `~/.config/mclovin/rules.toml`. Open it with
`mclovin` → "Open config file (Advanced)" or your editor of choice.

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
