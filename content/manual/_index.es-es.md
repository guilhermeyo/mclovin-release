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

El script descarga el binario a `~/.local/bin/mclovin`, registra mclovin como navegador predeterminado del sistema, e instala el atajo `mclovin.desktop` en el menú de apps.

Listo. Abre **mclovin** desde el launcher del sistema (Walker, rofi, menú de apps de GNOME/KDE).


## Cómo usar

mclovin es lo mismo por dos caminos: la GUI con flechas + Enter, o la CLI para scriptar. Las reglas viven siempre en `rules.toml`, así que lo único que cambia es cómo llegas a ellas.

<div class="dual-tabs">
<input type="radio" id="tab-gui" name="usage-tabs" checked>
<input type="radio" id="tab-cli" name="usage-tabs">
<div class="tabs-bar">
<label for="tab-gui">GUI</label>
<label for="tab-cli">CLI</label>
</div>
<div class="tab-panels">
<div class="tab-panel gui-panel">

**1. Picker — al hacer clic en un link sin regla**

![Picker de mclovin](https://cdn.guilherme44.com/mclovin/manual/01-picker-es-es.png)

Cuando una URL no coincide con ninguna regla del `rules.toml`, el picker salta al frente. Muestra la URL arriba y los navegadores detectados abajo. ↑/↓ o k/j navega, Enter abre. `Ctrl+,` te lleva a Configuración sin perder la URL.

**2. Configuración — `mclovin settings`**

![Menú principal](https://cdn.guilherme44.com/mclovin/manual/02-settings-main-es-es.png)

El hub. Cada fila lleva a un sub-menú: reglas, navegador predeterminado, diagnóstico, idioma, actualizaciones. ↑/↓ navega, Enter activa, q/Esc vuelve.

**3. Gestionar reglas**

![Lista de reglas](https://cdn.guilherme44.com/mclovin/manual/03-rules-list-es-es.png)

Lista cada regla: patrón a la izquierda, comando o navegador a la derecha. `a` añade, `e` o Enter edita, `d` elimina (con confirmación), `J/K` reordena.

**4. Añadir / editar una regla**

![Formulario](https://cdn.guilherme44.com/mclovin/manual/04-form-add-es-es.png)

Tres modos de coincidencia: **URL contiene** (substring), **URL empieza con** (host + ruta), **Regex** (control total). Lista de patrones abajo — Tab navega entre ellos y hasta el `+ Añadir patrón (Enter)`. El campo "Probar con una URL" valida en tiempo real qué patrón coincidiría.

**5. Saliendo con cambios sin guardar**

![Modal](https://cdn.guilherme44.com/mclovin/manual/05-modal-unsaved-es-es.png)

Esc en un formulario sucio abre esta protección. Seguir editando (Esc) es el default y seguro. Guardar (S) valida y persiste. Guardar borrador deja todo en un borrador que vuelve al abrir de nuevo. Descartar cambios, aparte y en rojo, tira los cambios.

**6. Actualizaciones — `Ctrl+U` desde cualquier pantalla**

![Pantalla de actualizaciones](https://cdn.guilherme44.com/mclovin/manual/06-updates-es-es.png)

Muestra la versión actual, cuándo fue el último chequeo y — cuando hay versión nueva — un botón "Instalar ahora" que descarga el binario, valida el `sha256` y dispara el ciclo de reinicio con barra de progreso y cuenta regresiva.

**7. Navegador predeterminado — `Ctrl+D` desde cualquier pantalla**

![Navegador predeterminado](https://cdn.guilherme44.com/mclovin/manual/07-default-browser-es-es.png)

Lista los navegadores detectados; la línea marcada es el handler actual del sistema. Enter en otra fila lo cambia vía `xdg-mime`/`xdg-settings`. mclovin va arriba como "requerido" — tiene que ser el default para que el ruteo haga algo.

**8. Diagnóstico**

![Doctor](https://cdn.guilherme44.com/mclovin/manual/08-doctor-es-es.png)

Verifica registro como handler, integridad de `rules.toml` y navegadores detectados. Cada línea en verde está OK; si algo sale en rojo, muestra el comando exacto para arreglarlo.

**9. Idioma**

![Selector de idioma](https://cdn.guilherme44.com/mclovin/manual/09-language-es-es.png)

Tres idiomas hoy. El cambio es instantáneo — no necesitas reiniciar la GUI.

### Atajos de la GUI

| Atajo | Qué hace |
|---|---|
| `↑` / `↓` o `k` / `j` | Navegar |
| `Enter` | Activar / abrir |
| `Esc` o `q` | Volver / cancelar |
| `Ctrl+,` | Del picker hacia Configuración |
| `Ctrl+D` | Salta a "Navegador predeterminado" |
| `Ctrl+U` | Salta a "Actualizaciones" |

</div>
<div class="tab-panel cli-panel">

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

</div>
</div>
</div>

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

mclovin es un único binario Rust con dos frontends que comparten el mismo core: CLI (scripts) y GUI (`mclovin settings`). Las reglas viven en disco en `rules.toml`, así que cualquier frontend lee la misma realidad.

## Actualizaciones automáticas

mclovin verifica nuevas versiones en background cada 2 horas, contra el repo [`mclovin-release`](https://github.com/guilhermeyo/mclovin-release/releases). Para apagarlo: `auto_update_check = false` en `~/.config/mclovin/preferences.toml`.

Para forzar una verificación, abre **Actualizaciones** y haz clic en "Buscar actualizaciones". El botón tiene debounce de 10 segundos entre clics consecutivos para no saturar la API de GitHub.

Cuando hay versión nueva:

1. La pantalla muestra `versión actual → versión nueva` en amarillo
2. Clic en "Instalar ahora" descarga el binario, valida el `sha256` e instala
3. Aparece una cuenta regresiva: `Reiniciando en 5… 4… 3… 2… 1…`
4. mclovin se reinicia solo en la nueva versión, volviendo a la misma pantalla

Si llegaste a Actualizaciones por `Ctrl+U` desde el picker, mclovin recuerda eso a través del reinicio y te devuelve al picker al presionar Esc en Actualizaciones.

## Avanzado — solo terminal

Cosas que la GUI no expone, todas en `~/.config/mclovin/rules.toml`. Edítalo vía `mclovin settings` → "Abrir archivo de configuración" o con tu editor.

### Referencia de `rules.toml`

Cada regla es un bloque `[[handler]]`. Los tres tipos de match abajo son los mismos que la GUI expone — aquí el equivalente en TOML.

```toml
# Substring — el más común
[[handler]]
match = "github.com"
browser = "brave"
description = "GitHub en Brave"

# Lista — cualquier elemento coincide
[[handler]]
match = ["wa.me", "web.whatsapp.com", "api.whatsapp.com"]
command = "zapzap"
description = "WhatsApp vía ZapZap"

# Regex — control total + grupos de captura
[[handler]]
match_regex = '^https?://open\.spotify\.com/(\w+)/([^?#/]+)'
rewrite = "spotify --uri=spotify:{1}:{2}"
description = "Spotify desktop"
```

### Browser vs comando

```toml
# Browser detectado por mclovin (lee el .desktop)
browser = "brave"

# Browser + profile específico
browser = { name = "google-chrome", profile = "Trabajo" }

# Comando shell raw (usa {url} para insertar la URL)
command = "firefox --new-window {url}"
```

### Fallback y catch-all

```toml
fallback_browser = "brave"

# O: regla catch-all (toda URL sin regla cae en Brave, sin picker)
[[handler]]
match_regex = '.*'
browser = "brave"
```

### Picker externo (fuzzel, walker, wofi, rofi, bemenu)

En vez del picker built-in (iced), puedes delegar a un launcher del sistema:

```toml
[picker]
enabled = true
command = "fuzzel"
options = ["--dmenu"]
```

El launcher recibe opciones por stdin y devuelve la elección por stdout — convención dmenu. Para deshabilitar el picker totalmente (y mandar todo a `fallback_browser`): `enabled = false`.

### Reglas dinámicas con Lua (`match_lua`)

Cuando el match no encaja en substring/regex — horario, host parseado, query string — escribe un snippet Lua:

```toml
# Atlassian solo en horario laboral
[[handler]]
match_lua = """
local h = ctx.now.hour
return (h >= 9 and h < 18) and ctx.url.host:match('atlassian') ~= nil
"""
browser = { name = "google-chrome", profile = "Trabajo" }
description = "Atlassian en horario laboral"
```

`ctx` carga `url` (con `.full`, `.host`, `.path`, `.query`), `now` (`.hour`, `.minute`, `.weekday`) y `source` (la app que originó el link, cuando disponible).

### Transformaciones complejas con `rewrite_lua`

Para reescribir URLs de formas que regex + template no resuelven (firmar, decodificar, lookups):

```toml
[[handler]]
match = "internal.api.example"
rewrite_lua = """
return ctx.url.full:gsub('^http://', 'https://'):gsub('/v1/', '/v2/')
"""
browser = "brave"
```

### Modo webapp (`mclovin --app=URL`)

Abre una URL como app dedicada (ventana sin barra de direcciones, ícono propio en la barra de tareas) usando el `[webapp].browser` configurado:

```bash
mclovin --app=https://meet.google.com/abc-xyz
```

Útil para crear `.desktop` shortcuts. En Omarchy, integra con `mclovin webapp-fix` (una vez) para que el launcher del Omarchy también reconozca mclovin como handler de webapps.

### Más recetas

`mclovin examples` imprime tres bloques copy-paste: substring/list básico, regex + rewrite, y escenarios Lua más elaborados.

## Solución de problemas

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

---

¿Algún problema? [Abre una issue en GitHub](https://github.com/guilhermeyo/mclovin-release/issues).
