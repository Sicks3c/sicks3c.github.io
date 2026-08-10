# SickSec Security Research Blog

The production source for [blog.sicks3c.io](https://blog.sicks3c.io/), built with Hugo. The site uses a custom Research Operations interface layered over the existing content and Hugo configuration.

## Local development

```sh
hugo server --disableFastRender
```

Open [http://localhost:1313/](http://localhost:1313/). Hugo watches the layouts, assets, configuration, and Markdown content for changes.

## Safe production preview

To inspect a production build without changing the deployed `docs/` directory:

```sh
preview_dir="$(mktemp -d)"
hugo --minify --destination "$preview_dir"
python3 -m http.server 4174 --directory "$preview_dir"
```

## Deployment

The configured publish directory is `docs/`. Run the following only when the local implementation has been reviewed and is ready to publish:

```sh
hugo --minify
```

Commit the resulting source and `docs/` changes, then publish through the repository's normal GitHub Pages workflow. The custom domain is retained through `static/CNAME`.

## Structure

- `content/` — article Markdown and front matter
- `layouts/` — custom Hugo templates and components
- `assets/css/console-site.css` — production visual system
- `assets/js/console-site.js` — navigation, search, filters, reader utilities, and UI enhancement
- `prototypes/` — the four original redesign directions and standalone readers
- `docs/` — generated deployment output; do not edit by hand
