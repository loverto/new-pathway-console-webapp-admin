/** 产品 */

import Layout from '@/views/layout/Layout'

const roles = ['ROLE_ADMIN']

const productRouter = {
  path: '/products',
  component: Layout,
  redirect: '/products/index',
  name: 'Products',
  meta: {
    title: '系统功能',
    icon: 'component'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/productMg/index'),
      name: 'ProductList',
      meta: {
        title: '电脑品牌管理',
        icon: 'list',
        roles
      }
    },
    {
      path: '/product/add',
      hidden: true,
      component: () => import('@/views/productMg/add'),
      name: 'FontList',
      meta: {
        title: '电脑品牌新增',
        icon: 'form',
        roles
      }
    },
    {
      path: '/font/index',
      component: () => import('@/views/fontMg/index'),
      name: 'FontList',
      meta: {
        title: '字体类型管理',
        icon: 'form',
        roles
      }
    },
    {
      path: '/font/add',
      hidden: true,
      component: () => import('@/views/fontMg/add'),
      name: 'FontAdd',
      meta: {
        title: '字体类型新增',
        icon: 'form',
        roles
      }
    },
    {
      path: '/font/edit',
      hidden: true,
      component: () => import('@/views/fontMg/edit'),
      name: 'FontEdit',
      meta: {
        title: '字体类型编辑',
        icon: 'form',
        roles
      }
    },
    {
      path: '/product/edit',
      hidden: true,
      component: () => import('@/views/productMg/edit'),
      name: 'ProductEdit',
      meta: {
        title: '编辑电脑品牌',
        icon: 'edit',
        roles
      }
    }
  ]
}

export default productRouter
