module.exports = {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended"
    ],
    "parserOptions": {
      "parser": "babel-eslint"
    },
    // plugins: [
    //     'html'
    // ],
    "parser": "vue-eslint-parser",
    rules: {
        'no-unused-vars': 'off',
        'vue/no-unused-vars': 'off',
        'vue/valid-v-for': 'off'
    }
}

// “off” or 0 - 关闭(禁用)规则 
// “warn” or 1 - 将规则视为一个警告（并不会导致检查不通过） 
// “error” or 2 - 将规则视为一个错误 (退出码为1，检查不通过) 