/** Banner管理 */

import Layout from '@/layout'

const roles = ['ROLE_ADMIN', 'ROLE_DISTRIBUTION']

const dataRouter = {
  path: '/data',
  component: Layout,
  redirect: '/data/index',
  name: 'Banners',
  meta: {
    title: '数据统计',
    icon: 'clipboard',
    roles
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/dataMg/index'),
      name: 'WorkList',
      meta: {
        title: '运行明细',
        icon: 'list',
        roles
      }
    },
    {
      path: '/data/sum',
      component: () => import('@/views/dataMg/sum'),
      name: 'WorkdSum',
      meta: {
        title: '运行汇总',
        icon: 'form',
        roles
      }
    }
  ]
}

export default dataRouter
