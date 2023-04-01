import ts from 'rollup-plugin-typescript2'
import path from 'path'
import dts from 'rollup-plugin-dts';

export default [
    {
        //入口文件
        input: "./src/core/index.ts",
        output: [
            // 输出好几种格式
            //打包成es：import export
            {
                file: path.resolve(__dirname, './dist/index.esm.js'),
                format: "es"
            },

            //打包common js：require exports
            {
                file: path.resolve(__dirname, './dist/index.cjs.js'),
                format: "cjs"
            },

            //打包 umd: AMD CMD global
            {

                input: "./src/core/index.ts",
                file: path.resolve(__dirname, './dist/index.js'),
                format: "umd",
                name: "tracker"
            }
        ],
        //配置ts
        plugins: [
            ts(),
        ]
    }, {
        // 输出声明文件 index.d.ts
        input: "./src/core/index.ts",
        output: {
            file: path.resolve(__dirname, './dist/index.d.ts'),
            format: "es",
        },
        plugins: [dts()]
    }
]