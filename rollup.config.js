import serve from 'rollup-plugin-serve';
export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'cjs'
    },
    plugins: [
        serve({
            contentBase: ['dist'],
            port: 8080
        })
    ]
};
