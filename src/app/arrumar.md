# 🧹 Checklist — Limpeza e revisão do Angular/HTML

## Objetivo

Revisar o código do portfólio para descobrir:

- Classes Tailwind que não estão fazendo nada.
- Classes antigas que ficaram depois de mudanças.
- Classes duplicadas ou desnecessárias.
- CSS customizado que não está mais sendo usado.
- Coisas que deveriam estar no `.ts` em vez do HTML.
- Coisas que poderiam ser feitas apenas com Tailwind.
- Animações/classes que foram criadas mas não estão mais sendo usadas.
- Possíveis problemas de organização sem mudar o visual ou comportamento atual.

> IMPORTANTE: não mudar o design, espaçamentos, animações ou comportamento sem necessidade.
> A ideia é somente limpar e organizar o que já existe.

---

# 📁 Arquivos que preciso enviar para uma revisão completa

Enviar estes arquivos:

## Angular

- `app.component.html`
- `app.component.ts`

## Contact

- `contact.html`
- `contact.ts`
- `contact.css`

## Estilos globais

- `styles.css`

## Se existir

Também enviar qualquer arquivo onde eu tenha colocado:

- `@keyframes`
- classes CSS próprias
- animações customizadas
- `.btn-primary`
- `.animate-scale-sync`
- outras classes que não sejam Tailwind

---

# 🔎 Coisas que já foram identificadas para verificar

## 1. `btn-primary`

No botão de currículo existe:

```html
btn-primary
