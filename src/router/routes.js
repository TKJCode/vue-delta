export const routes = [
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import('../views/Main.vue'),

        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/mainViews/Home.vue')
            },
            {
                path: 'classify',
                name: 'Classify',
                component: () => import('../views/mainViews/Classify.vue')
            },
            {
                path: 'hot',
                name: 'Hot',
                component: () => import('../views/mainViews/Hot.vue')
            },
            {
                path: 'shopcart',
                name: 'Shopcart',
                component: () => import('../views/mainViews/Shopcart.vue')
            },
            {
                path: 'my',
                name: 'My',
                component: () => import('../views/mainViews/My.vue')
            }
        ]
    },
    {
        path: '/detail',
        name: 'Detail',
        component: () => import('../views/Detail.vue'),
        // meta: {
        //     keepAlive: true,
        //     isBack: false
        // }
    },
    {
        path: '/goodsList',
        name: 'GoodsList',
        component: () => import('../views/GoodsList.vue')
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },
    {
        path: '/myCollect',
        name: 'MyCollect',
        component: () => import('../views/MyCollect.vue')
    },
    {
        path: '/pay',
        name: 'Pay',
        component: () => import('../views/Pay.vue')
    },
    {
        path: '/myAddress',
        name: 'MyAddress',
        component: () => import('../views/MyAddress.vue')
    },
    {
        path: '/newAddress',
        name: 'NewAddress',
        component: () => import('../views/NewAddress.vue')
    },
    {
        path: '/order',
        name: 'Order',
        component: () => import('../views/Order.vue')
    },

    // 重定向路由
    {
        path: '*',
        redirect: {
            name: 'Register'
        }
    }
]