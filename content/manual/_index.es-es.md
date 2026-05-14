+++
title = "Manual"
template = "manual.html"

[extra]
toc_label = "Contenido"
+++

## ¿Por qué existe mclovin?

mclovin nació de tres molestias diarias: links de Spotify abriéndose en el navegador en vez de la app, links del repo del trabajo cayendo en el profile equivocado de Chrome, links de Google Meet del cliente abriéndose donde está la cámara del trabajo. En macOS lo resolvía con [Finicky](https://github.com/johnste/finicky) y creía que estaba en paz.

Con IA acelerando el prototipo, la primera versión funcionó en pocos minutos y resolvió mi propio setup. Resolverlo solo para mí era poco. Pasé más tiempo puliéndolo hasta convertirlo en algo que cualquier persona con el mismo problema puede usar.

La misión es cubrir los tres sistemas y, en el camino, exponer lo que los sistemas operativos y los navegadores llevan demasiado tiempo sin resolver. La versión alpha para Linux ya está funcionando; macOS y Windows llegan pronto. ¿Algún problema? [Abre una issue en GitHub](https://github.com/guilhermeyo/mclovin-release/issues). Haces clic en un link y se abre en el lugar correcto. Sin preguntar qué profile, sin cerrar la ventana incorrecta, sin perder dos minutos por cada link.

## Instalación

Linux x86_64 por ahora. macOS y Windows en las próximas releases.

```bash
curl -fsSL https://mclovin.org/install.sh | bash
```

El script descarga el binario a `~/.local/bin/mclovin`, valida su `sha256` y termina. `~/.local/bin` ya está en `$PATH` en cualquier distro moderna.

Para confirmar:

```bash
mclovin --version
```

## Primeros pasos

Tres comandos para dejar mclovin listo:

```bash
mclovin config init    # crea ~/.config/mclovin/rules.toml
mclovin setup          # registra mclovin como navegador predeterminado
mclovin doctor         # diagnostica la instalación
```

Si mclovin no está registrado como predeterminado, **el ruteo no corre** — cada link sigue yendo al handler anterior. `mclovin doctor` indica exactamente qué falta.

Para revertir: `mclovin unsetup`.

Una primera regla de ejemplo en `rules.toml`:

```toml
fallback_browser = "brave"

[[handler]]
match = "github.com"
browser = "brave"
description = "GitHub en Brave"
```

¿Guardado? Haz clic en cualquier link de `github.com` y abre en Brave. El resto cae en `fallback_browser` (también Brave aquí) o muestra el picker si no hay regla que coincida.

## Cómo funciona

```
[clic en un link]
        ↓
[el SO entrega el http/https a mclovin]
        ↓
[mclovin lee ~/.config/mclovin/rules.toml]
        ↓
   ┌──────────────────────┐
   │ ¿alguna regla coincide? │
   └──────────────────────┘
       sí ↓                 no ↓
[abre el browser/comando]   [el picker pregunta]
```

mclovin es un único binario Rust con dos frontends que comparten el mismo core: CLI (scripts) y GUI (`mclovin settings`). Las reglas se comportan igual en cualquier frontend porque viven en disco en `rules.toml`.

## Configurando reglas

El archivo es `~/.config/mclovin/rules.toml`. Cada `[[handler]]` es una regla match → acción.

### Tipos de match

```toml
# Substring (el más común)
[[handler]]
match = "github.com"
browser = "brave"

# Lista de dominios — cualquiera coincide
[[handler]]
match = ["wa.me", "web.whatsapp.com", "api.whatsapp.com"]
command = "zapzap"

# Regex (control total)
[[handler]]
match_regex = '^https?://open\.spotify\.com/'
command = "spotify --uri={url}"
```

### Browser vs comando

```toml
# Browser detectado (mclovin encuentra el .desktop y lo lanza)
browser = "brave"

# Browser con un profile específico
browser = { name = "chrome", profile = "Trabajo" }

# Comando de shell raw (usa {url} para insertar la URL)
command = "firefox --new-window {url}"
```

### Reescritura de URL

Combinada con regex, puedes transformar la URL antes de pasarla:

```toml
[[handler]]
match_regex = '^https?://open\.spotify\.com/(\w+)/([^?#/]+)'
rewrite = "spotify --uri=spotify:{1}:{2}"
description = "Spotify desktop"
```

`{1}` y `{2}` son los grupos de captura del regex.

### Fallback y picker

```toml
# Cuando ninguna regla coincide
fallback_browser = "brave"

[picker]
enabled = true
# command = ""   # default: picker GUI iced; o configura como fuzzel/walker/wofi/rofi/bemenu
```

¿Quieres que **toda** URL sin regla abra directo en Brave (sin picker)? Agrega una regla catch-all:

```toml
[[handler]]
match_regex = '.*'
browser = "brave"
```

`mclovin examples` tiene más recetas listas para copiar/pegar.

## Frontends

mclovin tiene tres interfaces que comparten el mismo core:

| Interfaz | Cómo abrir | Cuándo usar |
|---|---|---|
| **GUI Settings** | `mclovin settings` o Walker → "mclovin Settings" | Mouse + teclado, navegación por menús |
| **Picker** | Aparece al hacer clic en un link sin regla (Ctrl+Shift+B en Hyprland) | Elección rápida de browser por URL |

### Atajos

En la GUI:

| Atajo | Qué hace |
|---|---|
| `↑` / `↓` o `k` / `j` | Navegar |
| `Enter` | Activar / abrir |
| `Esc` o `q` | Volver / cancelar |
| `Ctrl+,` | Del picker hacia Configuración |
| `Ctrl+D` | Salta directo a "Navegador predeterminado" |
| `Ctrl+U` | Salta directo a "Actualizaciones" |

## Actualizaciones automáticas

mclovin verifica nuevas versiones en background cada 2 horas, contra el repo [`mclovin-release`](https://github.com/guilhermeyo/mclovin-release/releases). Para apagarlo: `auto_update_check = false` en `~/.config/mclovin/preferences.toml`.

Para forzar una verificación, abre **Actualizaciones** y haz clic en "Buscar actualizaciones". El botón tiene debounce de 10 segundos entre clics consecutivos para no saturar la API de GitHub.

Cuando hay versión nueva:

1. La pantalla muestra `versión actual → versión nueva` en amarillo
2. Clic en "Instalar ahora" descarga el binario, valida el `sha256` e instala
3. Aparece una cuenta regresiva: `Reiniciando en 5… 4… 3… 2… 1…`
4. mclovin se reinicia solo en la nueva versión, volviendo a la misma pantalla

Si llegaste a Actualizaciones por `Ctrl+U` desde el picker, mclovin recuerda eso a través del reinicio y te devuelve al picker al presionar Esc en Actualizaciones.

## Referencia CLI

Todos los comandos aceptan `--quiet` (suprime salida no esencial) y `--json` (salida en JSON donde aplique).

| Comando | Qué hace |
|---|---|
| `mclovin setup` | Registra mclovin como navegador predeterminado |
| `mclovin unsetup` | Revierte el registro |
| `mclovin doctor` | Diagnostica la instalación (handler, binario, .desktop) |
| `mclovin match URL` | Muestra qué regla coincidiría con la URL (sin abrir) |
| `mclovin status` | Estadísticas de uso |
| `mclovin config init` | Crea el `rules.toml` inicial |
| `mclovin examples` | Imprime recetas listas para copiar/pegar |
| `mclovin lang [LANG]` | Muestra o cambia el idioma de la UI (`en`, `pt-BR`, `es-ES`) |
| `mclovin log [-f]` | Muestra (o sigue) el log del día |
| `mclovin list-browsers` | Lista navegadores detectados |
| `mclovin rules list` | Lista las reglas de `rules.toml` |
| `mclovin rules add ...` | Agrega una regla desde la CLI |
| `mclovin rules delete ...` | Elimina una regla |
| `mclovin default-browser` | Inspecciona o cambia el navegador predeterminado |
| `mclovin fallback-browser` | Inspecciona o cambia el `fallback_browser` |
| `mclovin settings` | Abre la GUI de configuración |
| `mclovin update` | Verifica e instala actualizaciones |
| `mclovin --app=URL` | Abre la URL como webapp (ventana sin barra) |

`mclovin --help` lista todo. `mclovin <comando> --help` muestra detalles por comando.

## Troubleshooting

### Dónde viven los archivos

| Archivo | Qué |
|---|---|
| `~/.config/mclovin/rules.toml` | Reglas de ruteo |
| `~/.config/mclovin/preferences.toml` | Idioma, auto-actualización |
| `~/.cache/mclovin/log.YYYY-MM-DD` | Log del día |
| `~/.cache/mclovin/update_check.toml` | Cache de verificación de actualización |
| `~/.local/bin/mclovin` | Binario canónico |
| `~/.local/share/applications/mclovin.desktop` | Entry MIME para `http` / `https` |

### Diagnosticar

```bash
mclovin doctor          # chequeo completo
mclovin log -f          # sigue el log del día en vivo
mclovin --version       # binario en $PATH
mclovin match https://github.com/foo/bar    # qué regla coincidiría
```

### "Versión equivocada" después de actualizar

Puedes tener dos binarios en el sistema (`~/.local/bin/mclovin` y `~/.cargo/bin/mclovin` si instalaste con `cargo install` antes). `setup` apunta todo al canónico `~/.local/bin/`, pero vale revisar:

```bash
which -a mclovin
ls -la ~/.local/bin/mclovin ~/.cargo/bin/mclovin 2>/dev/null
```

Si hay dos, copia el más nuevo sobre el viejo:

```bash
install -m 755 ~/.local/bin/mclovin ~/.cargo/bin/mclovin
```

### Resetear el cache de actualización

```bash
rm ~/.cache/mclovin/update_check.toml
```

En el siguiente arranque, mclovin re-consulta el release público.
