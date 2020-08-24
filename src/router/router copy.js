// 导入Vue
import Vue from 'vue'

// 导入路由
import VueRouter from 'vue-router'

import { menus } from '../api/http'

// use一下
Vue.use(VueRouter)


// 导入组件
import login from '../views/01.login.vue'
import index from '../views/02.index.vue'


import users from '../views/03.userlist.vue'
import rights from '../views/04.rights.vue'
import roles from '../views/05.roles.vue'
import categories from '../views/06.categories.vue'
import params from '../views/07.params.vue'

import goods from '../views/goods/goods.vue'
import goodsIndex from '../views/goods/index.vue'
import addGoods from '../views/goods/add.vue'

import reports from '../views/08.reports.vue'
import orders from '../views/09.orders.vue'


// 准备规则
const routes = [
    // 登录页
    { path: "/login", component: login },

    // 首页
    {
        path: "/index", component: index,
        // 子路由
        children: [
            { path: '/users', component: users, meta: { needLogin: true } },
            { path: '/rights', component: rights, meta: { needLogin: true } },
            { path: '/roles', component: roles, meta: { needLogin: true } },
            { path: '/categories', component: categories, meta: { needLogin: true } },
            { path: '/params', component: params, meta: { needLogin: true } },
            { path: '/reports', component: reports, meta: { needLogin: true } },
            { path: '/orders', component: orders, meta: { needLogin: true } },
            {
                path: '/goods',
                component: goods,
                meta: { needLogin: true },
                children: [
                    { path: '', component: goodsIndex },
                    { path: 'add', component: addGoods },
                ]
            },
        ]
    },
]

// 创建路由对象
const router = new VueRouter({
    routes
})

// // 全局导航守卫
// router.beforeEach((to, from, next) => {

//     // window.console.log(to);
//     // 如果你有这个标签，就代表你要做登录验证
//     if (to.meta.needLogin) {

//         //判断是否有登录，就是判断有没有token,有代表登录，没有代表没登录
//         //还是要经过服务器，让服务器告诉我这是不是有效token
//         menus().then(res => {

//             if (res.data.meta.status == 400 && res.data.meta.msg == '无效token') {

//                 //没值
//                 //提示请先登录
//                 Vue.prototype.$message.error('请先登录！')
//                 // 打回登录页
//                 router.push('/login')

//             } else {

//                 //有值代表登录，那么就放行
//                 next()
//             }
//         })

//     } else {

//         // 访问其他页
//         next();
//     }
// })


export default router