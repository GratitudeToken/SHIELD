# Installation
```
npm i @bloks/numbers
```

# Asset

```js
import { Asset } from '@bloks/numbers'

const asset1 = new Asset({
  code: 'XPR',
  precision: 4,
  amount: 10
})

console.log(asset1.symbol.code) // "XPR"
console.log(asset1.symbol.precision) // 4
console.log(asset1.amount) // BN(10)
console.log(asset1.amount.toNumber()) // 10
console.log(asset1.amount.toString()) // "10""

const asset2 = new Asset({
  code: 'XPR',
  precision: 4,
  amount: 100
})

console.log(asset1.isEqualTo(asset2)) // false
console.log(asset1.isLooselyEqualTo(asset2)) // true
```