/** 代理商 */

import Layout from '@/layout'

const roles = ['ROLE_ADMIN']

const agentRouter = {
  path: '/agents',
  component: Layout,
  redirect: '/agents/index',
  meta: {
    title: '用户软件授权',
    icon: 'user',
    roles
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/userinfoMg/index'),
      name: 'UserinfoList',
      meta: {
        title: '用户管理',
        icon: 'peoples',
        roles
      }
    },
    {
      path: '/userinfo/add',
      component: () => import('@/views/userinfoMg/add'),
      name: 'UserinfoAdd',
      hidden: true,
      meta: {
        title: '用户新增',
        icon: 'peoples',
        roles
      }
    },
    {
      path: '/authorization/index',
      component: () => import('@/views/authorizationMg/index'),
      name: 'ComputerTypesList',
      meta: {
        title: '授权管理',
        icon: 'list',
        roles
      }
    },
    {
      path: '/authorization/add',
      hidden: true,
      component: () => import('@/views/authorizationMg/add'),
      name: 'ComputerTypesAdd',
      meta: {
        title: '授权新增',
        icon: 'form',
        roles
      }
    },
    {
      path: 'audit',
      component: () => import('@/views/agentMg/audit'),
      name: 'AuditList',
      meta: {
        title: '审核信息',
        icon: 'edit',
        roles
      }
    }
  ]
}

export default agentRouter
