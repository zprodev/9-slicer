import resolve from 'rollup-plugin-node-resolve';

const output = [];
const plugins = [];
if(process.env.BROWSER){
  output.push({
    file: 'dist/browser/9slicer.js',
    format: 'iife',
    name: 'pnges'
  });
  output.push({
    file: 'dist/esm/9slicer.js',
    format: 'es',
  });
  plugins.push(
    resolve()
  );
}else{
  output.push({
    file: 'dist/cjs/9slicer.js',
    format: 'cjs',
  });
}

export default {
  input: 'dist/tsc/index.js',
  output: output,
  plugins: plugins
};