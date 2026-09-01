# Generation 2 and Motion Engine CLI

Version 0.3 installs `appblocks-v2` beside the backward-compatible `appblocks` command.

```bash
appblocks-v2 --help
```

When running directly from a clone, replace `appblocks-v2` with `node bin/appblocks-v2.js`.

## Build compact source

```bash
appblocks-v2 build examples/motion-showcase.ab --out dist --strict
```

For a subpath deployment:

```bash
appblocks-v2 build examples/motion-showcase.ab --out dist --base /product/ --strict
```

## Validate without writing files

```bash
appblocks-v2 check examples/motion-showcase.ab --strict
```

## Inspect canonical expansion

```bash
appblocks-v2 normalize examples/motion-showcase.ab
```

Normalization expands compact block IDs, design recipes and motion tokens into canonical contracts and finite generated classes. It does not emit arbitrary authored CSS or JavaScript.

## Query the address spaces

```bash
appblocks-v2 recipe r7314
appblocks-v2 virtual b203
appblocks-v2 motion x731
appblocks-v2 motion cinematic hero
appblocks-v2 catalog carousel --json
appblocks-v2 catalog --extended --json
```

`motion x731` returns the exact deterministic motion tuple. `motion cinematic hero` returns the named cinematic preset; the optional block name is useful when querying `auto` role-aware defaults.

## Compact motion examples

```ab
st "Project" r=r7314 fx=cinematic
  pg "/" title="Project"
    hr017 fx="hero sx:depth"
      ttl "A complete animated site" lvl=1
      b203 "Start" h="/start" hx=magnetic px=ripple
    sc247 sx=parallax-y en=clip-up cx=cascade du=slow
```

See [`MOTION.md`](MOTION.md) for the complete token and effect catalog.

The original `appblocks` command retains build, dev, validate, inspect, catalog and token commands. Canonical source without compact or motion tokens follows the Generation-1 path. Aliases, design recipes, semantic macros, virtual IDs and motion tokens activate the Generation-2 compiler path.
