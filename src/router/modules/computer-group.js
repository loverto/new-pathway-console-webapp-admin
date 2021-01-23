/** 系统功能 */

import Layout from '@/layout'

const dev = ['ROLE_ADMIN', 'ROLE_DEVELOPMENT']

const systemFeature = {
  path: '/computer-types',
  component: Layout,
  redirect: '/computer-types/index',
  name: 'ComputerTypes',
  meta: {
    title: '系统功能',
    icon: 'component'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/computerGroupMg/index'),
      name: 'ComputerTypesList',
      meta: {
        title: '分组管理',
        icon: 'list',
        dev
      }
    },
    {
      path: '/computer-groups/add',
      hidden: true,
      component: () => import('@/views/computerGroupMg/add'),
      name: 'ComputerTypesAdd',
      meta: {
        title: '分组新增',
        icon: 'form',
        dev
      }
    },
    {
      path: '/computer/index',
      component: () => import('@/views/computerMg/index'),
      name: 'ComputerList',
      meta: {
        title: '计算机管理',
        icon: 'form',
        dev
      }
    },
    {
      path: '/computer/add',
      hidden: true,
      component: () => import('@/views/computerMg/add'),
      name: 'ComputerAdd',
      meta: {
        title: '计算机编辑',
        icon: 'form',
        dev
      }
    },
    {
      path: '/software-types/index',
      component: () => import('@/views/softwareTypeMg/index'),
      hidden: true,
      name: 'SoftwareTypeList',
      meta: {
        title: '软件类型管理',
        icon: 'table',
        dev
      }
    },
    {
      path: '/software-types/add',
      hidden: true,
      component: () => import('@/views/softwareTypeMg/add'),
      name: 'SoftwareTypeAdd',
      meta: {
        title: '软件类型新增',
        icon: 'form',
        dev
      }
    },
    {
      path: '/software/index',
      component: () => import('@/views/softwareMg/index'),
      name: 'SoftwareList',
      meta: {
        title: '软件管理',
        icon: 'component',
        dev
      }
    },
    {
      path: '/software/add',
      hidden: true,
      component: () => import('@/views/softwareMg/add'),
      name: 'SoftwareAdd',
      meta: {
        title: '软件新增',
        icon: 'form',
        dev
      }
    }
  ]
}

export default systemFeature
