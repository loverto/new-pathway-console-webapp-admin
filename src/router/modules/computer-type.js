/** 产品 */

import Layout from '@/views/layout/Layout'

const roles = ['ROLE_ADMIN']
const dev = ['ROLE_ADMIN', 'ROLE_DEVELOPMENT']

const productRouter = {
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
      component: () => import('@/views/computerTypeMg/index'),
      name: 'ComputerTypesList',
      meta: {
        title: '品牌管理',
        icon: 'list',
        dev
      }
    },
    {
      path: '/computer-type/add',
      hidden: true,
      component: () => import('@/views/computerTypeMg/add'),
      name: 'ComputerTypesAdd',
      meta: {
        title: '品牌新增',
        icon: 'form',
        dev
      }
    },
    {
      path: '/font/index',
      component: () => import('@/views/fontMg/index'),
      name: 'FontList',
      meta: {
        title: '字体管理',
        icon: 'form',
        dev
      }
    },
    {
      path: '/font/add',
      hidden: true,
      component: () => import('@/views/fontMg/add'),
      name: 'FontAdd',
      meta: {
        title: '字体新增',
        icon: 'form',
        dev
      }
    },
    {
      path: '/font/edit',
      hidden: true,
      component: () => import('@/views/fontMg/edit'),
      name: 'FontEdit',
      meta: {
        title: '字体编辑',
        icon: 'form',
        dev
      }
    },
    {
      path: '/computer-type/edit',
      hidden: true,
      component: () => import('@/views/computerTypeMg/edit'),
      name: 'ComputerTypesEdit',
      meta: {
        title: '电脑品牌',
        icon: 'edit',
        dev
      }
    },
    {
      path: '/computer-type/settings',
      component: () => import('@/views/configMg/settings'),
      name: 'Settings',
      meta: {
        title: '参数设置',
        icon: 'edit',
        roles
      }
    }
  ]
}

export default productRouter
