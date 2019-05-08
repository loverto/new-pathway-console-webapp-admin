/** Banner管理 */

import Layout from '@/views/layout/Layout'

const roles = ['ROLE_ADMIN']

const bannerRouter = {
  path: '/customs',
  component: Layout,
  redirect: '/customs/index',
  name: 'Customs',
  meta: {
    title: '定单流程',
    icon: 'example'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/customTemplateMg/index'),
      name: 'customConfirm',
      meta: {
        title: '定单确认',
        icon: 'list',
        roles
      }
    },
    {
      path: '/custom-template/make',
      component: () => import('@/views/customTemplateMg/add'),
      name: 'makeCustom',
      meta: {
        title: '定单制造',
        icon: 'form',
        roles
      }
    },
    {
      path: '/custom/add',
      component: () => import('@/views/customTemplateMg/add'),
      name: 'CustomSent',
      meta: {
        title: '定单发货',
        icon: 'form',
        roles
      }
    },
    {
      path: '/custom/add',
      component: () => import('@/views/customTemplateMg/add'),
      name: 'BannerAdd',
      meta: {
        title: '定单管理',
        icon: 'form',
        roles
      }
    }
  ]
}

export default bannerRouter
