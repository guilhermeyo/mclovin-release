+++
title = "Manual"
template = "manual.html"

[extra]
toc_label = "Sumário"
+++

## Por que o mclovin existe?

O mclovin nasceu de três dores diárias: link do Spotify abrindo no navegador em vez do app, link de repositório do trabalho caindo no profile errado do Chrome, link de Google Meet do cliente abrindo onde a câmera do trabalho está. No macOS eu resolvia com o [Finicky](https://github.com/johnste/finicky) e achava que estava em paz.

Com IA pra acelerar o protótipo, a primeira versão saiu em alguns minutos e resolveu pro meu setup. Resolver só pra mim era pequeno demais. Passei mais tempo polindo até virar algo que qualquer pessoa que sofra com isso pode usar.

A missão é cobrir os três sistemas e, no caminho, expor o que os sistemas operacionais e os navegadores estão deixando de fazer há tempo demais. A versão alpha para Linux já está funcionando, macOS e Windows chegam em breve. Qualquer problema, [abra uma issue no GitHub](https://github.com/guilhermeyo/mclovin-release/issues). Você clica num link e ele abre no lugar certo. Sem perguntar qual profile, sem fechar janela errada, sem perder dois minutos por clique.

## Instalação

Linux x86_64 por enquanto. macOS e Windows nas próximas releases.

```bash
curl -fsSL https://mclovin.org/install.sh | bash
```

O script baixa o binário pra `~/.local/bin/mclovin`, registra o mclovin como navegador padrão do sistema, e instala o atalho `mclovin.desktop` no menu de apps.

Pronto. Abre o **mclovin** pelo launcher do sistema (Walker, rofi, menu de apps do GNOME/KDE).


## Como usar

O mclovin é a mesma coisa por dois caminhos: a GUI com setas + Enter, ou a CLI pra scriptar. As regras estão sempre no `rules.toml`, então o que muda é só como você chega lá.

<div class="dual-tabs">
<input type="radio" id="tab-gui" name="usage-tabs" checked>
<input type="radio" id="tab-cli" name="usage-tabs">
<div class="tabs-bar">
<label for="tab-gui">GUI</label>
<label for="tab-cli">CLI</label>
</div>
<div class="tab-panels">
<div class="tab-panel gui-panel">

**1. Picker — quando você clica num link sem regra**

![Picker do mclovin](/manual/01-picker-pt-br.png)

Sempre que uma URL não bate em nenhuma regra do `rules.toml`, o picker pula na frente. Mostra a URL no topo, lista os navegadores detectados embaixo. ↑/↓ ou k/j navega, Enter abre. `Ctrl+,` te leva pra Configurações sem perder a URL.

**2. Configurações — `mclovin settings`**

![Menu principal](/manual/02-settings-main-pt-br.png)

O hub central. Cada linha leva a um sub-menu: regras, navegador padrão, diagnóstico, idioma, atualizações. ↑/↓ navega, Enter ativa, q/Esc volta.

**3. Gerenciar regras**

![Lista de regras](/manual/03-rules-list-pt-br.png)

Lista cada regra: padrão à esquerda, comando ou navegador à direita. `a` adiciona, `e` ou Enter edita, `d` deleta (pede confirmação), `J/K` reordena.

**4. Adicionar / editar uma regra**

![Formulário de regra](/manual/04-form-add-pt-br.png)

Três modos de combinar a URL: **URL contém** (substring), **URL começa com** (host + path), **Regex** (poder total). Lista de padrões abaixo — Tab navega entre eles e até o `+ Adicionar padrão (Enter)`. O campo "Testar com uma URL" valida em tempo real qual padrão bateria.

**5. Saindo com alterações não salvas**

![Modal de alterações](/manual/05-modal-unsaved-pt-br.png)

Esc num formulário sujo abre essa proteção. Continuar editando (Esc) é o default e seguro. Salvar (S) valida e persiste. Salvar rascunho parqueia tudo num draft que volta na próxima abertura. Descartar mudanças, separado em vermelho, joga fora.

**6. Atualizações — `Ctrl+U` de qualquer tela**

![Tela de atualizações](/manual/06-updates-pt-br.png)

Mostra a versão atual, quando foi o último check, e — quando tem release nova — um botão "Instalar agora" que baixa, valida o `sha256`, e dispara o ciclo de restart com countdown e barra de progresso.

**7. Navegador padrão — `Ctrl+D` de qualquer tela**

![Navegador padrão](/manual/07-default-browser-pt-br.png)

Lista os navegadores detectados; a linha marcada é o handler atual do sistema. Enter em outra entrada troca via `xdg-mime`/`xdg-settings`. O mclovin sempre aparece no topo como "obrigatório" — ele precisa ser o padrão pra qualquer roteamento rolar.

**8. Diagnóstico**

![Doctor](/manual/08-doctor-pt-br.png)

Checa registro como handler, integridade do `rules.toml`, e navegadores detectados. Cada linha em verde é OK; se algo aparecer em vermelho, mostra o comando exato pra arrumar.

**9. Idioma**

![Picker de idioma](/manual/09-language-pt-br.png)

Três idiomas hoje. A troca é instantânea — não precisa reiniciar a GUI.

### Atalhos da GUI

| Atalho | O que faz |
|---|---|
| `↑` / `↓` ou `k` / `j` | Navegar |
| `Enter` | Ativar / abrir |
| `Esc` ou `q` | Voltar / cancelar |
| `Ctrl+,` | Do picker pra Configurações |
| `Ctrl+D` | Pula pra "Navegador padrão" |
| `Ctrl+U` | Pula pra "Atualizações" |

</div>
<div class="tab-panel cli-panel">

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
| `mclovin settings` | Abre a GUI de configurações |
| `mclovin update` | Checa e instala atualizações |
| `mclovin --app=URL` | Abre URL como webapp (janela chromeless) |

`mclovin --help` lista tudo. `mclovin <comando> --help` mostra detalhes de cada um.

</div>
</div>
</div>

## Como funciona

```
[clique no link]
      ↓
[OS chama o handler http/https = mclovin]
      ↓
[mclovin lê ~/.config/mclovin/rules.toml]
      ↓
   ┌──────────────────────┐
   │ alguma regra bate?   │
   └──────────────────────┘
      sim ↓                 não ↓
[abre o browser/comando]   [picker pergunta]
```

O mclovin é um único binário Rust com dois frontends compartilhando o mesmo core: CLI (scripts) e GUI (`mclovin settings`). As regras vivem em disco no `rules.toml`, então qualquer frontend lê a mesma realidade.

## Atualizações automáticas

O mclovin faz check de novas versões em background a cada 2 horas, contra o repositório [`mclovin-release`](https://github.com/guilhermeyo/mclovin-release/releases). Pra desligar: `auto_update_check = false` em `~/.config/mclovin/preferences.toml`.

Pra forçar um check, abre **Atualizações** e clica em "Verificar atualizações". O botão tem debounce de 10 segundos entre clicks consecutivos pra evitar spam na API do GitHub.

Quando há versão nova:

1. Tela mostra `versão atual → versão nova` em amarelo
2. Click em "Atualizar agora" baixa o binário, valida o `sha256`, e instala
3. Aparece um countdown `Reiniciando em 5… 4… 3… 2… 1…`
4. O mclovin reinicia sozinho na nova versão, voltando pra mesma tela onde você estava

Se você clica `Ctrl+U` no picker, o mclovin lembra disso através do restart e te traz de volta pro picker quando você dá Esc na tela de Atualizações.

## Avançado — só pelo terminal

Coisas que a GUI não expõe e que moram direto no `~/.config/mclovin/rules.toml`. Edite com `mclovin settings` → "Abrir arquivo de configuração" ou com o seu editor preferido.

### Referência do `rules.toml`

Cada regra é um bloco `[[handler]]` no arquivo. As três formas de match abaixo são as mesmas que a GUI expõe — aqui você vê o equivalente em TOML.

```toml
# Substring — mais comum
[[handler]]
match = "github.com"
browser = "brave"
description = "GitHub no Brave"

# Lista — qualquer item bate
[[handler]]
match = ["wa.me", "web.whatsapp.com", "api.whatsapp.com"]
command = "zapzap"
description = "WhatsApp via ZapZap"

# Regex — controle total + capture groups
[[handler]]
match_regex = '^https?://open\.spotify\.com/(\w+)/([^?#/]+)'
rewrite = "spotify --uri=spotify:{1}:{2}"
description = "Spotify desktop"
```

### Browser vs comando

```toml
# Browser detectado pelo mclovin (lê o .desktop)
browser = "brave"

# Browser + profile específico
browser = { name = "google-chrome", profile = "Trabalho" }

# Comando shell raw (use {url} pra inserir a URL)
command = "firefox --new-window {url}"
```

### Fallback e regra catch-all

```toml
fallback_browser = "brave"

# OU: regra catch-all (toda URL sem regra cai em Brave, sem picker)
[[handler]]
match_regex = '.*'
browser = "brave"
```

### Picker externo (fuzzel, walker, wofi, rofi, bemenu)

Em vez do picker built-in (iced), você pode delegar pra um launcher do sistema:

```toml
[picker]
enabled = true
command = "fuzzel"
options = ["--dmenu"]
```

O launcher recebe as opções via stdin e retorna a escolha via stdout — convenção dmenu. Para desabilitar o picker totalmente (e jogar tudo no `fallback_browser`): `enabled = false`.

### Regras dinâmicas com Lua (`match_lua`)

Quando o match não cabe em substring/regex — horário, host parseado, query string — escreva uma função Lua:

```toml
# Atlassian só no horário comercial
[[handler]]
match_lua = """
local h = ctx.now.hour
return (h >= 9 and h < 18) and ctx.url.host:match('atlassian') ~= nil
"""
browser = { name = "google-chrome", profile = "Trabalho" }
description = "Atlassian em horário comercial"
```

`ctx` carrega `url` (com `.full`, `.host`, `.path`, `.query`), `now` (`.hour`, `.minute`, `.weekday`) e `source` (app que originou o link, quando disponível).

### Transformação complexa com `rewrite_lua`

Pra reescrever a URL de forma que regex+template não dão conta (assinaturas, decodificação, lookups):

```toml
[[handler]]
match = "internal.api.example"
rewrite_lua = """
return ctx.url.full:gsub('^http://', 'https://'):gsub('/v1/', '/v2/')
"""
browser = "brave"
```

### Modo webapp (`mclovin --app=URL`)

Abre uma URL como aplicação dedicada (janela sem barra de endereço, ícone próprio na barra de tarefas) usando o `[webapp].browser` configurado:

```bash
mclovin --app=https://meet.google.com/abc-xyz
```

Útil pra criar atalhos `.desktop` de webapps. Em Omarchy, integre via `mclovin webapp-fix` (uma vez) pra que o launcher do Omarchy também reconheça o mclovin como handler de webapps.

### Mais receitas

`mclovin examples` imprime três blocos prontos pra copiar/colar: substring/list básico, regex+rewrite, e cenários Lua mais elaborados.

## Solução de problemas

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

---

Qualquer problema, [abra uma issue no GitHub](https://github.com/guilhermeyo/mclovin-release/issues).
