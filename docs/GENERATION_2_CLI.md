# Generation 2 CLI

Version 0.2 installs `appblocks-v2` beside the backward-compatible `appblocks` command.

```bash
appblocks-v2 --help
```

When running directly from a clone, replace `appblocks-v2` with `node bin/appblocks-v2.js`.

## Build compact source

```bash
appblocks-v2 build examples/generation2-showcase.ab --out dist --strict
```

Use `--base` when deploying below an origin root, including GitHub Pages project sites:

```bash
appblocks-v2 build examples/generation2-showcase.ab \
  --out dist \
  --base /app-blocks-web/ \
  --strict
```

The compiler prefixes project-relative links and generated runtime assets with the normalized base path.

## Validate without writing files

```bash
appblocks-v2 check examples/generation2-showcase.ab --strict
```

## Inspect canonical expansion

```bash
appblocks-v2 normalize examples/generation2-showcase.ab
```

## Query the address space

```bash
appblocks-v2 recipe r7314
appblocks-v2 virtual b203
appblocks-v2 catalog carousel --json
appblocks-v2 catalog --extended --json
```

The original `appblocks` command retains build, dev, validate, inspect, catalog and token commands. Both commands use the same conditional compiler: canonical source follows the generation-1 path, while aliases, recipes, semantic macros and virtual IDs activate Generation 2.
