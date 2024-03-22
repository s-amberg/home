const path = require('path');
module.exports = {
  webpack: {
    //   alias: {
    //     data: path.resolve(__dirname, 'data/'),
    // },
    configure: (config) => {
        // config.module.rules.unshift({
        //     test: /\.(ts|tsx)$/,
        //     use: [
        //         {
        //             loader: 'ts-loader',
        //             options: {
        //                 projectReferences: true,
        //             }
        //         }
        //     ]
        // })     
        // this is a hack until CRA supports project references
        const scopePluginIndex = config.resolve.plugins.findIndex(
            ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
        );

        config.resolve.plugins.splice(scopePluginIndex, 1);
        return config;
    }
  },

};