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
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/views/home/home')
      }
    ]
  },
  {
    path: '/',
    name: 'subSysManager',
    component: Main,
    meta: {
      title: '系统管理',
      icon: 'md-settings'
    },
    children: [
      {
        path: '/sub-system',
        component: () => import('@/views/sub-system/list.vue'),
        name: 'subSystemList',
        meta: {
          title: '子系统列表',
          icon: 'md-construct',
          beforeCloseName: 'before_close_normal'
        }
      },
      {
        path: '/module',
        component: () => import('@/views/module/list.vue'),
        name: 'moduleList',
        meta: {
          title: '模块列表'
        }
      },
      {
        path: '/module-fun',
        component: () => import('@/views/module-fun/list.vue'),
        name: 'moduleFunList',
        meta: {
          title: '功能列表'
        }
      }
    ]
  },
  {
    path: '/',
    name: 'userManager',
    component: Main,
    meta: {
      title: '用户管理',
      icon: 'md-person'

    },
    children: [
      {
        path: '/user',
        component: () => import('@/views/user/list.vue'),
        name: 'userList',
        meta: {
          title: '用户列表',
          icon: 'md-list'
        }
      },
      {
        path: '/role',
        component: () => import('@/views/user/list.vue'),
        name: 'role-list',
        meta: {
          title: '角色列表'
        }
      }
    ]
  },
  {
    path: '/',
    name: 'dictManager',
    component: Main,
    meta: {
      showAlways: true,
      title: '字典管理',
      icon: 'md-paper'
    },
    children: [
      {
        path: '/dict',
        component: () => import('@/views/dict/list.vue'),
        name: 'dictList',
        meta: {
          title: '字典列表',
          icon: 'md-list'
        }
      }
    ]
  }
]
