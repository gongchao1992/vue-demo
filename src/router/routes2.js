import Main from '@/components/main'
export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    meta: {
      title: '登陆',
      hideInMenu: true,
      notCache: true
    }
  },
  {
    path: '/',
    name: '_home',
    component: Main,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/home')
      }
    ]
  },
  {
    path: '/',
    name: 'subSysManager',
    component: Main,
    children: [
      {
        path: '/sub-system',
        component: () => import('@/views/sub-system/list.vue'),
        name: 'subSystemList'
      },
      {
        path: '/module',
        component: () => import('@/views/module/list.vue'),
        name: 'moduleList'
      },
      {
        path: '/module-fun',
        component: () => import('@/views/module-fun/list.vue'),
        name: 'moduleFunList'
      }
    ]
  },
  {
    path: '/',
    name: 'userManager',
    component: Main,
    children: [
      {
        path: '/user',
        component: () => import('@/views/user/list.vue'),
        name: 'userList'
      },
      {
        path: '/role',
        component: () => import('@/views/user/list.vue'),
        name: 'role-list'
      }
    ]
  },
  {
    path: '/',
    name: 'dictManager',
    component: Main,
    children: [
      {
        path: '/dict',
        component: () => import('@/views/dict/list.vue'),
        name: 'dictList'
      }
    ]
  }
]
