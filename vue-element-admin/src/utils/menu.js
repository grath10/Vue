const _import = require('../router/_import_' + process.env.NODE_ENV)

import Layout from '../views/layout/Layout'

/*
{
	path: '/errlog',
	component: Layout,
	redirect: 'noredirect',
	name: 'errlog',
	icon: 'bug',
	noDropdown: true,
	children: [{ path: 'log', component: _import('errlog/index'), name: '错误日志' }]
}
*/
function generateMenu(routers, data){
	data.forEach((item) => {
		let menu = Object.assign({}, item)
		if(!item.leaf){
			menu.component = Layout
			routers = generateMenu(menu.children = [], item.children)
			menu.children = routers
		}else{
			menu.component = _import(menu.directory)
		}
		routers.push(menu)
	})
	return routers
}

export default(routers, data) => {
  generateMenu(routers, data)
}
