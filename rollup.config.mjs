import { terser } from 'rollup-plugin-terser';

export default {
    input: ['./app.js', "./injector.js"], // multiple inputs
    output: {
        dir: 'dist', // output directory
        // file: "bundle.js",
        format: 'es', // or 'es', 'umd', etc.

    },
    plugins: [
        terser() // minifies the output
    ]

};