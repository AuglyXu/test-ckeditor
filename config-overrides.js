const { override, addWebpackAlias, addWebpackModuleRule, addWebpackPlugin } = require('customize-cra');
const path = require('path');
// const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolve(dir) {
    return path.join(__dirname, '.', dir);
}

const CKERegex = {
    svg: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
    css: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/,
};
const targetCSS = /\.css$/;
const targetSVG = /\.svg$/;
const targetFont = /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/;
const targetModuleCSS = /\.module\.css$/;

const handleExcludedRegexp = (rules) => {
    // exclude CKE regex from mix's default rules
    for (let rule of rules) {
        if (rule.oneOf) {
            handleExcludedRegexp(rule.oneOf)
        } else {
            if (rule.test) {
                if (rule.test.toString() === targetSVG.toString()) {
                    rule.exclude = CKERegex.svg;
                }
                else if (rule.test.toString() === targetFont.toString()) {
                    rule.exclude = CKERegex.svg;
                }
                else if ([targetCSS.toString(), targetModuleCSS.toString()].includes(rule.test.toString() === targetCSS.toString())) {
                    rule.exclude = CKERegex.css;
                }
            }
        }
    }
}

const svgLoaderOverWrite = () => config => {
    const rules = config.module.rules;
    handleExcludedRegexp(rules)
    return config;
}

module.exports = override(
    process.env.BUNDLE_ANA ? addWebpackPlugin(new BundleAnalyzerPlugin()) : null,
    addWebpackModuleRule({ test: CKERegex.svg, use: ["raw-loader"] }),
    addWebpackModuleRule({
        test: CKERegex.css, use: [
            {
                loader: 'style-loader',
                options: {
                    injectType: 'singletonStyleTag',
                    attributes: {
                        'data-cke': true
                    }
                }
            },
            'css-loader',
            // {
            //     loader: 'postcss-loader',
            //     options: {
            //         postcssOptions: styles.getPostCssConfig({
            //             themeImporter: {
            //                 themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
            //             },
            //             minify: true
            //         })
            //     }
            // }
        ]
    }),
    svgLoaderOverWrite(),
    // 为文件夹取别名
    addWebpackAlias({
        '@': resolve('src'),
    }),
)
