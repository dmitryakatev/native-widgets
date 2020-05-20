
module.exports = () => {
    var production = false;

    var proces = arguments[5];
    var node_env = 'NODE_ENV';
    var params;

    if (proces) {
        if (Array.isArray(proces.argv)) {
            params = proces.argv;
        } else {
            if (typeof proces.argv === 'string') {
                params = [proces.argv];
            }
        }
    }

    if (params) {
        params.forEach((str) => {
            if (str.indexOf(node_env) !== -1) {
                if (str.split('=')[1] === 'production') {
                    production = true;
                }
            }
        });
    }

    return {
        plugins: [
            require('autoprefixer')
        ]
        /*plugins: {
            'autoprefixer': {},
            'cssnano': production ? {} : false
        }*/
    }
};
