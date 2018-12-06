const {slice} = require('../dist/cjs/9slicer');
const {parse} = require('png.es');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const PLAIN_PNG = fs.readFileSync(path.join(__dirname, 'in', 'plain.png'));
const FRAME_PNG = fs.readFileSync(path.join(__dirname, 'in', 'frame.png'));
const MARGIN_PNG = fs.readFileSync(path.join(__dirname, 'in', 'margin.png'));
const LATERAL_STRIPE_PNG = fs.readFileSync(path.join(__dirname, 'in', 'lateral_stripe.png'));
const VERTICAL_STRIPE_PNG = fs.readFileSync(path.join(__dirname, 'in', 'vertical_stripe.png'));
const GRADATION_PNG = fs.readFileSync(path.join(__dirname, 'in', 'gradation.png'));

const PLAIN_PNG_OUT = fs.readFileSync(path.join(__dirname, 'out', 'plain.png'));
const FRAME_PNG_OUT = fs.readFileSync(path.join(__dirname, 'out', 'frame.png'));
const MARGIN_PNG_OUT = fs.readFileSync(path.join(__dirname, 'out', 'margin.png'));
const LATERAL_STRIPE_PNG_OUT = fs.readFileSync(path.join(__dirname, 'out', 'lateral_stripe.png'));
const VERTICAL_STRIPE_PNG_OUT = fs.readFileSync(path.join(__dirname, 'out', 'vertical_stripe.png'));
const GRADATION_PNG_OUT = fs.readFileSync(path.join(__dirname, 'out', 'gradation.png'));

describe('slice', function() {
  it('plain', function() {
    const result = slice(PLAIN_PNG);
    assert.deepEqual(
      parse(PLAIN_PNG_OUT).data,
      parse(result.buffer).data,
    )
  });
  it('frame', function() {
    const result = slice(FRAME_PNG);
    assert.deepEqual(
      parse(FRAME_PNG_OUT).data,
      parse(result.buffer).data,
    )
  });
  it('margin', function() {
    const result = slice(MARGIN_PNG);
    assert.deepEqual(
      parse(MARGIN_PNG_OUT).data,
      parse(result.buffer).data,
    )
  });
  it('lateral stripe', function() {
    const result = slice(LATERAL_STRIPE_PNG);
    assert.deepEqual(
      parse(LATERAL_STRIPE_PNG_OUT).data,
      parse(result.buffer).data,
    )
  });
  it('vertical stripe', function() {
    const result = slice(VERTICAL_STRIPE_PNG);
    assert.deepEqual(
      parse(VERTICAL_STRIPE_PNG_OUT).data,
      parse(result.buffer).data,
    )
  });
  it('gradation', function() {
    const result = slice(GRADATION_PNG);
    assert.deepEqual(
      parse(GRADATION_PNG_OUT).data,
      parse(result.buffer).data,
    )
  });
});