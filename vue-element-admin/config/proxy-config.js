var restUrls = ['/login', '/user/**', '/menu', '/logout', '/device/**', '/history/**', '/parameter/**'];
var proxy = {};
const path = 'http://localhost:8080'
for (var i = restUrls.length - 1; i >= 0; i--) {
	var context = restUrls[i]
	proxy[context] = {
		target: path, // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
            // 需要rewrite重写
        }
	}
};
module.exports = proxy