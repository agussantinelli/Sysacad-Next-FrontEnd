---
name: accessibility
description: Reglas obligatorias para garantizar la accesibilidad web (A11y) en Sysacad-Next. Sigue estándares WCAG 2.1 para usuarios con discapacidad visual y navegación por teclado.
---

# ♿ Web Accessibility (A11y) - Estándar Sysacad-Next

Esta skill define las reglas obligatorias para que la interfaz de Sysacad-Next sea inclusiva. Todo componente nuevo o modificado en el frontend **debe** cumplir con estos lineamientos de accesibilidad sin comprometer la estética premium.

## 📋 Reglas de Oro (Mandatory)

### 1. Etiquetas de Interacción (`aria-label`)
Cualquier botón, enlace o control que use únicamente un icono (Material Icons / Fontsource) **DEBE** tener un `aria-label` descriptivo en el idioma de la interfaz (Español).
- **✅ Correcto**: `<button aria-label="Cerrar ventana"><mat-icon>close</mat-icon></button>`
- **❌ Incorrecto**: `<button><mat-icon>close</mat-icon></button>`

### 2. Iconos Decorativos (`aria-hidden`)
Todos los iconos que no aporten información semántica (ej: flechas de adorno, iconos junto a texto descriptivo) **DEBEN** tener `aria-hidden="true"`.
- **✅ Correcto**: `<span><mat-icon aria-hidden="true">school</mat-icon> Académico</span>`
- **❌ Incorrecto**: `<span><mat-icon>school</mat-icon> Académico</span>` (El lector de voz dirá el nombre del icono).

### 3. Navegación por Teclado
- **Foco Visible**: Nunca elimines el `outline` del foco a menos que proveas una alternativa visual clara (como clases de Angular Material o estados CSS personalizados).
- **Tabulación Lógica**: Los elementos interactivos deben seguir el orden visual del DOM.
- **Eventos Combinados**: Los elementos no semánticos (ej: un `div` que actúa como botón, aunque se prefiere usar `<button>`) deben manejar `onKeyDown` (teclas Enter y Space).

### 4. Regiones Dinámicas (`aria-live`)
Para componentes que actualizan contenido sin recargar la página (Chat de Mensajes, Alertas, Notificaciones), usa `aria-live` para anunciar cambios a los lectores de pantalla.
- `aria-live="polite"`: Para mensajes informativos (ej: "Nota cargada exitosamente").
- `aria-live="assertive"`: Para errores críticos (ej: "Se perdió la conexión con el servidor").

### 5. Semántica de Estructura
- Usa **Landmarks** (`<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`).
- Mantén una jerarquía de encabezados coherente (`h1` -> `h2` -> `h3`). No saltes niveles (ej: de `h1` a `h4`).
- Usa `role="region"` y `aria-labelledby` en secciones complejas como el Plan de Estudios o el Perfil.

## 🛠️ Checklist de Validación
- [ ] ¿Todos los botones tienen texto visible o un `aria-label`?
- [ ] ¿Los iconos decorativos están ocultos para los lectores (`aria-hidden`)?
- [ ] ¿Puedo completar el flujo principal (ej: inscripción a cursado) usando solo el teclado (`Tab` + `Enter`)?
- [ ] ¿Los cambios de estado (cargando, éxito, error) se anuncian?
- [ ] ¿Las imágenes tienen un `alt` descriptivo (o `alt=""` si son decorativas)?

---

_Cualquier componente que ignore estas reglas será considerado un fallo de calidad técnica._
