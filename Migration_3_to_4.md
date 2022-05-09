# Migration `3.x.x` to `4.x.x`

## Support `esnext` module

It now supports `esnext` modules. But the default value is still the `umd` module. In order to use the esnext `module`, you must use it as follows.

```javascript
import { Relationship } from 'https://cdn.jsdelivr.net/npm/node-relation@4.x.x/dist/esm/index.min.js'
```

## Support for mutable status instances

Since an instance is basically an immutable object, it creates a new instance when calling a method. However, there may be parts that require performance. In that case, use `raw`.

```javascript
import { Relationship } from 'https://cdn.jsdelivr.net/npm/node-relation@4.x.x/dist/esm/raw/index.min.js'
// or
import { Relationship } from 'https://cdn.jsdelivr.net/npm/node-relation@4.x.x/dist/umd/raw/index.min.js'
```

## Methods

Added new methods.

### `where`

### `hasAll`

### `weight` (>=4.1.0)

### `weights` (>=4.1.0)

### (getter)`oneHot` (>=4.2.0)

### (getter)`label` (>=4.2.0)

### (getter)`zeroVector` (>=4.2.1)

### `depth` (>=4.3.0)

### `distance` (>=4.3.1)

### (getter)`clusters` (>=4.4.0)

### `merge` (>=4.4.0)

### (getter)`reverse` (>=4.6.0)

### `raw` (>=4.6.0)

### (getter)`children` (>=4.6.2)

### `entry` (>=4.7.0)

### `entries` (>=4.7.0)

Some method names have been changed.

### `setReferTo` => `to`

### `setReferBoth` => `both`

### `setReferAll` => `all`

### `getRelation` => `from`

### `dropNode` => `drop`

### `hasNode` => `has`

Some methods have been deleted. Use `without` methods instead.

### `getNodes`

### `getNodeset`

### `getAmbientNodes`

### `getAmbientNodeset`

```javascript
const A = state.getNodes('a')
// to
const A = state.without('a')
```
