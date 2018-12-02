import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login',
  component: () => import('@/views/login/index'),
  meta: { title: 'login',
  icon: 'example' },},
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'eye',roles: ['admin','editor'] }
    }]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '账号管理', icon: 'form',roles: ['editor'] }
      }
    ]
  },
  {
  path: '/excel',
  component: Layout,
  redirect: '/excel',
  name: 'excel',
  meta: {
    title: 'excel',
    icon: 'excel',
    roles: ['admin']
  },
   children: [
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/uploadExcel'),
        name: 'UploadExcel',
        meta: { title: 'Excel上传',roles: ['admin'] }
      }
  ]
},
 // {
 //  path: '/mapsearch',
 //  component: Layout,
 //  redirect: '/mapsearch',
 //  name: 'mapsearch',
 //  meta: {
 //    title: 'mapsearch',
 //    icon: 'excel',
 //    roles: ['admin']
 //  },
//    children: [
//       {
//         path: 'mapsearch',
//         component: () => import('@/views/dashboard/admin/mapsearch'),
//         name: 'mapsearch',
//         meta: { title: '地图',roles: ['admin'] }
//       }
//   ]
// },
  {
  path: '/table',
  component: Layout,
  redirect: '/table',
  name: 'Table',
  meta: {
    title: '设备管理',
    icon: 'table',
  },
      children: [{
      path: 'table',
      component: () => import('@/views/table/bandtable'),
      meta: { title: '设备总表' }
    },
    {
      path: 'tableDetail',
      component: () => import('@/views/table/bandtableDetail'),
      meta: { title: '详情页' }
      }
    ]
},

    {
  path: '/charts',
  component: Layout,
  name: 'charts',
  meta: {
    title: 'charts',
    icon: 'chart',
    roles: ['editor']
  },
   children: [
    {
      path: 'export-excel',
      component: ()=>import('@/views/charts'),
      name: 'charts',
      meta: { title: '统计图表' }
    }
  ]
},
{
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission',
          // roles: ['editor']
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'http://tiyuxi.sjtu.edu.cn/',
        meta: { title: '学院首页', icon: 'link' }
      }
    ]
  },
  {
    path: '/userCentre',
    component: Layout,
    redirect: '/userCentre',
    name: 'userCentre',
    children: [{
      path: '/userCentre',
      component: () => import('@/views/userCentre/index'),
      meta: { title: '个人中心', icon: 'user', roles: ['admin'] }
    }]
  },
  {
    path: '/userCentre/task/:task_uid',
    component: Layout,
    redirect: '/userCentre/task/:task_uid',
    name: '/userCentre/task',
    children: [{
      path: '/userCentre/task/:task_uid',
      component: () => import('@/views/userCentre/task'),
      meta: { title: '订单详情', roles: ['admin'] }
    }],
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
{
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },


  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link', roles: ['admin', 'editor']  }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
