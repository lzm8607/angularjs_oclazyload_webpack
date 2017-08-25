/**
 * Created by Jimmy on 2017/8/25.
 *
 * support for webpack3
 */
module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: ['last 5 versions']
        })
    ]
}