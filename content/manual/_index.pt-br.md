+++
title = "Manual"
template = "manual.html"

[extra]
toc_label = "Sumário"
+++

## Por que o mclovin existe

O mclovin nasceu de três dores diárias: link do Spotify abrindo no navegador em vez do app, link de repositório do trabalho caindo no profile errado do Chrome, link de Google Meet do cliente abrindo onde a câmera do trabalho está. No macOS eu resolvia com o [Finicky](https://github.com/johnste/finicky) e achava que estava em paz. Aí migrei pra Linux e o problema voltou — só que dessa vez sem ferramenta equivalente.

Com IA pra acelerar o protótipo, a primeira versão saiu em alguns minutos e resolveu pro meu setup. Resolver só pra mim era pequeno demais. Passei mais tempo polindo até virar algo que qualquer pessoa que sofra com isso pode usar.

A missão é cobrir os três sistemas (Linux já está, macOS chega em `0.2`, Windows em `0.3`) e, no caminho, expor o que os sistemas operacionais e os navegadores estão deixando de fazer há tempo demais. Você clica num link e ele abre no lugar certo. Sem perguntar qual profile, sem fechar janela errada, sem perder dois minutos por clique.

## Instalação

Linux x86_64 por enquanto. macOS e Windows nas próximas releases.

```bash
curl -fsSL https://mclovin.org/install.sh | bash
```

O script baixa o binário pra `~/.local/bin/mclovin`, valida o `sha256` e termina. `~/.local/bin` já está no `$PATH` da maioria das distros modernas.

Pra confirmar:

```bash
mclovin --version
```

## Primeiros passos

Três comandos pra deixar o mclovin em pé:

```bash
mclovin config init    # cria ~/.config/mclovin/rules.toml
mclovin setup          # registra o mclovin como navegador padrão do sistema
mclovin doctor         # diagnostica a instalação
```

Se o `mclovin` não estiver registrado como padrão, **nada do roteamento roda** — todo link continua indo pro handler antigo. O `mclovin doctor` aponta exatamente isso quando der ruim.

Pra reverter: `mclovin unsetup`.

Primeira regra de exemplo no `rules.toml`:

```toml
fallback_browser = "brave"

[[handler]]
match = "github.com"
browser = "brave"
description = "GitHub no Brave"
```

Salvou? Clica em qualquer link de `github.com` e ele cai no Brave. O resto vai pro `fallback_browser` (também Brave aqui) ou abre o picker se nenhuma regra bater.

## Como funciona

```
[click no link]
      ↓
[OS chama o handler http/https = mclovin]
      ↓
[mclovin lê ~/.config/mclovin/rules.toml]
      ↓
   ┌──────────────────────┐
   │ alguma rule bate?    │
   └──────────────────────┘
      sim ↓                 não ↓
[abre o browser/comando]   [picker pergunta]
```

O mclovin é um único binário Rust com três frontends compartilhando o mesmo core: CLI (scripts), TUI (`mclovin menu` no terminal) e GUI (`mclovin settings`). As regras são as mesmas em qualquer frontend porque vivem em disco no `rules.toml`.

## Configurando regras

O arquivo é `~/.config/mclovin/rules.toml`. Cada `[[handler]]` é uma regra match → ação.

### Tipos de match

```toml
# Substring (mais comum)
[[handler]]
match = "github.com"
browser = "brave"

# Lista de domínios — qualquer um deles bate
[[handler]]
match = ["wa.me", "web.whatsapp.com", "api.whatsapp.com"]
command = "zapzap"

# Regex (controle total)
[[handler]]
match_regex = '^https?://open\.spotify\.com/'
command = "spotify --uri={url}"
```

### Browser vs comando

```toml
# Browser detectado (mclovin acha o .desktop e dispara)
browser = "brave"

# Browser com profile específico
browser = { name = "chrome", profile = "Trabalho" }

# Comando shell raw (precisa do {url} pra inserir a URL)
command = "firefox --new-window {url}"
```

### Reescrita de URL

Combinada com regex, dá pra transformar a URL antes de passar pro app:

```toml
[[handler]]
match_regex = '^https?://open\.spotify\.com/(\w+)/([^?#/]+)'
rewrite = "spotify --uri=spotify:{1}:{2}"
description = "Spotify desktop"
```

Os `{1}`, `{2}` são capture groups do regex.

### Fallback e picker

```toml
# Quando nenhuma regra bate
fallback_browser = "brave"

[picker]
enabled = true
# command = "tui"   # opcional: abre o picker em uma janela TUI (alacritty)
                    # padrão: picker GUI iced
```

Quer que **toda** URL sem regra abra direto no Brave (sem picker)? Coloca uma regra catch-all:

```toml
[[handler]]
match_regex = '.*'
browser = "brave"
```

Veja `mclovin examples` pra mais recipes copy-paste.

## Frontends

O mclovin tem três interfaces que compartilham o mesmo core:

| Interface | Como abrir | Quando usar |
|---|---|---|
| **GUI Settings** | `mclovin settings` ou Walker → "mclovin Settings" | Mouse + teclado, navegação por menus |
| **TUI Menu** | `mclovin menu` no terminal | Quando você já está no terminal e prefere ratatui |
| **Picker** | Aparece quando você clica num link sem regra (Ctrl+Shift+B no Hyprland) | Escolha rápida de browser por URL |

### Atalhos

Tanto na GUI quanto na TUI:

| Atalho | O que faz |
|---|---|
| `↑` / `↓` ou `k` / `j` | Navegar |
| `Enter` | Ativar / abrir |
| `Esc` ou `q` | Voltar / cancelar |
| `Ctrl+,` | Do picker pra Configurações |
| `Ctrl+D` | Pula direto pra tela "Navegador padrão" |
| `Ctrl+U` | Pula direto pra tela "Atualizações" |

## Atualizações automáticas

O mclovin faz check de novas versões em background a cada 2 horas, contra o repositório [`mclovin-release`](https://github.com/guilhermeyo/mclovin-release/releases). Pra desligar: `auto_update_check = false` em `~/.config/mclovin/preferences.toml`.

Pra forçar um check, abre **Atualizações** e clica em "Verificar atualizações". O botão tem debounce de 10 segundos entre clicks consecutivos pra evitar spam na API do GitHub.

Quando há versão nova:

1. Tela mostra `versão atual → versão nova` em amarelo
2. Click em "Atualizar agora" baixa o binário, valida o `sha256`, e instala
3. Aparece um countdown `Reiniciando em 5… 4… 3… 2… 1…`
4. O mclovin reinicia sozinho na nova versão, voltando pra mesma tela onde você estava

Se você clica `Ctrl+U` no picker, o mclovin lembra disso através do restart e te traz de volta pro picker quando você dá Esc na tela de Atualizações.

## Referência CLI

Todos os comandos aceitam `--quiet` (suprime output não-essencial) e `--json` (saída em JSON onde aplicável).

| Comando | O que faz |
|---|---|
| `mclovin setup` | Registra o mclovin como navegador padrão do sistema |
| `mclovin unsetup` | Reverte a registração |
| `mclovin doctor` | Diagnostica instalação (handler, binário, .desktop) |
| `mclovin match URL` | Mostra qual regra bateria pra essa URL (sem abrir) |
| `mclovin status` | Stats de uso |
| `mclovin config init` | Cria `rules.toml` inicial |
| `mclovin examples` | Imprime recipes prontas pra copiar/colar |
| `mclovin lang [LANG]` | Mostra ou troca o idioma da UI (`en`, `pt-BR`, `es-ES`) |
| `mclovin log [-f]` | Mostra (ou segue) o log do dia |
| `mclovin list-browsers` | Lista navegadores detectados no sistema |
| `mclovin rules list` | Lista regras de `rules.toml` |
| `mclovin rules add ...` | Adiciona uma regra via CLI |
| `mclovin rules delete ...` | Remove uma regra |
| `mclovin default-browser` | Inspeciona ou troca o navegador padrão do sistema |
| `mclovin fallback-browser` | Inspeciona ou troca o `fallback_browser` |
| `mclovin menu` | Abre o menu TUI |
| `mclovin settings` | Abre a GUI de configurações |
| `mclovin update` | Checa e instala atualizações |
| `mclovin --app=URL` | Abre URL como webapp (janela chromeless) |

`mclovin --help` lista tudo. `mclovin <comando> --help` mostra detalhes de cada um.

## Troubleshooting

### Onde ficam os arquivos

| Arquivo | O quê |
|---|---|
| `~/.config/mclovin/rules.toml` | Regras de roteamento |
| `~/.config/mclovin/preferences.toml` | Idioma, auto-update |
| `~/.cache/mclovin/log.YYYY-MM-DD` | Log do dia |
| `~/.cache/mclovin/update_check.toml` | Cache de check de atualização |
| `~/.local/bin/mclovin` | Binário canônico |
| `~/.local/share/applications/mclovin.desktop` | Entry MIME pra `http`/`https` |

### Diagnosticar

```bash
mclovin doctor          # checagem completa
mclovin log -f          # acompanha o log em tempo real
mclovin --version       # versão do binário em $PATH
mclovin match https://github.com/foo/bar    # mostra qual regra bateria
```

### "Versão errada" depois de atualizar

Pode ter dois binários no sistema (`~/.local/bin/mclovin` e `~/.cargo/bin/mclovin` se você instalou com `cargo install` antes). O `setup` aponta tudo pro canônico em `~/.local/bin/`, mas vale conferir:

```bash
which -a mclovin
ls -la ~/.local/bin/mclovin ~/.cargo/bin/mclovin 2>/dev/null
```

Se tiver dois, copia o mais novo por cima do antigo:

```bash
install -m 755 ~/.local/bin/mclovin ~/.cargo/bin/mclovin
```

### Resetar o check de atualização

```bash
rm ~/.cache/mclovin/update_check.toml
```

Próxima vez que abrir, o mclovin re-checa o release público.
