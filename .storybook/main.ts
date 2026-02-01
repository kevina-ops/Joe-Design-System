import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    'storybook-design-token',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config: any) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '..'),
      };
    }
    const babelOptions = {
      presets: [
        [require.resolve('@babel/preset-env'), { modules: false }],
        [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
        [require.resolve('@babel/preset-typescript'), { allowDeclareFields: true }],
      ],
    };
    const babelLoader = {
      loader: require.resolve('babel-loader'),
      options: babelOptions,
    };
    const addBabelToRule = (rule: any) => {
      if (rule.use && Array.isArray(rule.use)) {
        rule.use.push(babelLoader);
      } else if (rule.oneOf) {
        rule.oneOf.forEach(addBabelToRule);
      }
    };
    const ruleUsesLoader = (rule: any, name: string) => {
      if (!rule) return false;
      const check = (u: any) => {
        if (typeof u === 'string') return u.includes(name);
        if (u && u.loader) return String(u.loader).includes(name);
        return false;
      };
      if (rule.use && Array.isArray(rule.use)) return rule.use.some(check);
      if (rule.loader) return check(rule.loader);
      return false;
    };
    const ruleMatchesJsxOrTsx = (r: any) =>
      r.test && (r.test.toString().includes('jsx') || r.test.toString().includes('tsx'));
    config.module.rules.forEach((rule: any) => {
      if (ruleUsesLoader(rule, 'csf-plugin') || ruleUsesLoader(rule, 'export-order-loader')) {
        addBabelToRule(rule);
      }
      if (ruleMatchesJsxOrTsx(rule) && rule.use && !rule.use.some((u: any) => String(u?.loader || u).includes('babel-loader'))) {
        addBabelToRule(rule);
      }
      if (rule.oneOf) {
        rule.oneOf.forEach((r: any) => {
          if (ruleUsesLoader(r, 'csf-plugin') || ruleUsesLoader(r, 'export-order-loader')) {
            addBabelToRule(r);
          }
          if (ruleMatchesJsxOrTsx(r) && r.use && !r.use.some((u: any) => String(u?.loader || u).includes('babel-loader'))) {
            addBabelToRule(r);
          }
        });
      }
    });

    config.module.rules.unshift({
      test: /\.(tsx?|jsx)$/,
      exclude: [/node_modules/, /\.(stories|story)\.(js|jsx|ts|tsx)$/],
      enforce: 'pre',
      use: [{ loader: require.resolve('babel-loader'), options: babelOptions }],
    });

    const cssRule = config.module.rules.find(
      (r: any) => r.test && r.test.toString().includes('css') && !r.test.toString().includes('module')
    );
    if (cssRule && cssRule.use) {
      const cssLoader = cssRule.use.find((u: any) => String(u?.loader || u).includes('css-loader'));
      const hasPostcss = cssRule.use.some((u: any) => String(u?.loader || u).includes('postcss-loader'));
      if (!hasPostcss && cssLoader) {
        const postcssLoader = {
          loader: require.resolve('postcss-loader'),
          options: { postcssOptions: { config: path.resolve(__dirname, '..') } },
        };
        cssRule.use = [].concat(cssRule.use);
        cssRule.use.push(postcssLoader);
        if (cssLoader.options) cssLoader.options.importLoaders = (cssLoader.options.importLoaders || 0) + 1;
      }
    }

    return config;
  },
};

export default config;
