# 9-slicer

[![Build Status](https://travis-ci.org/zprodev/9-slicer.svg?branch=master)](https://travis-ci.org/zprodev/9-slicer)
[![npm](https://img.shields.io/npm/v/9-slicer.svg)](https://www.npmjs.com/package/9-slicer)
[![license](https://img.shields.io/github/license/zprodev/9-slicer.svg)](LICENSE)

Automatically judge the enlarged area and create 9 slice images

## Examples

### input

![input.png](https://raw.githubusercontent.com/zprodev/9-slicer/master/docs/img/input.png)

### output

Sliced PNG

![output.png](https://raw.githubusercontent.com/zprodev/9-slicer/master/docs/img/output.png)

Parameters

```
{ width: 420,
  height: 240,
  left: 46,
  right: 45,
  top: 48,
  bottom: 48 }
```

## Demo

[9 SLICER](https://zprodev.github.io/9-slicer/demo/)

## Distribution

### npm

```
npm i -D 9-slicer
```

### files

[for CommonJS](https://github.com/zprodev/9-slicer/tree/master/dist/cjs)

[for Browser](https://github.com/zprodev/9-slicer/tree/master/dist/browser)

[for ESModules](https://github.com/zprodev/9-slicer/tree/master/dist/esm)

## Usage

### for CommonJS

```
const { readFileSync, writeFileSync }  = require('fs');
const { slice } = require('9-slicer');

const input = readFileSync('input.png');
const output = slice(input);

// Example of outputting only things that can be reduced by 30% or more
if(30 <= output.reduction){
  writeFileSync('output.png', output.buffer);
  writeFileSync('output.json', JSON.stringify(output.params));
}
```