# Generation 2 CLI

The generation-2 branch includes a separate command-line entry point so the compact compiler can be exercised without changing the legacy package binary prematurely.

```bash
node bin/appblocks-v2.js --help
```

## Build a compact source file

```bash
node bin/appblocks-v2.js build examples/generation2-showcase.ab --out dist --strict
```

## Validate without writing files

```bash
node bin/appblocks-v2.js check examples/generation2-showcase.ab --strict
```

## Inspect canonical expansion

```bash
node bin/appblocks-v2.js normalize examples/generation2-showcase.ab
```

## Query the address space

```bash
node bin/appblocks-v2.js recipe r7314
node bin/appblocks-v2.js virtual b203
node bin/appblocks-v2.js catalog carousel --json
node bin/appblocks-v2.js catalog --extended --json
```

The legacy CLI remains untouched on this branch. After the generation-2 compatibility matrix is green, the new command path can replace or be aliased from the package binary in a separate, easy-to-review change.
