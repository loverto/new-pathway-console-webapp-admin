/** Banner管理 */

import Layout from '@/views/layout/Layout'

const roles = ['ROLE_ADMIN']

const bannerRouter = {
  path: '/banners',
  component: Layout,
  redirect: '/banners/index',
  name: 'Banners',
  meta: {
    title: '文件管理',
    icon: 'example'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/bannerMg/index'),
      name: 'BannerList',
      meta: {
        title: '刀模图管理',
        icon: 'list',
        roles
      }
    },
    {
      path: '/banner/add',
      hidden: true,
      component: () => import('@/views/bannerMg/add'),
      name: 'dieAdd',
      meta: {
        title: '刀模图添加',
        icon: 'form',
        roles
      }
    },
    {
      path: '/banner/add',
      hidden: true,
      component: () => import('@/views/bannerMg/edit'),
      name: 'dieEdit',
      meta: {
        title: '刀模图编辑',
        icon: 'form',
        roles
      }
    },
    {
      path: '/image/index',
      component: () => import('@/views/bannerMg/index'),
      name: 'image',
      meta: {
        title: '官方图库',
        icon: 'form',
        roles
      }
    },
    {
      path: '/font-package/add',
      component: () => import('@/views/bannerMg/add'),
      name: 'font',
      meta: {
        title: '字体包管理',
        icon: 'form',
        roles
      }
    }
  ]
}

export default bannerRouter
