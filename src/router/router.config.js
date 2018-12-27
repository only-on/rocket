// 路由配置
const router = [
  {
    path: '/home',
    component: resolve => require(['../page/home.vue'], resolve),
    children: [
      {
        path: '/distribution',
        name: 'distribution',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/distribution/index.vue'], resolve)
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/user/index.vue'], resolve)
      },
      {
        path: '/shells',
        name: 'shells',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/shells/stockIn.vue'], resolve)
      },
      {
        path: '/stockOut',
        name: 'stockOut',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/shells/stockOut.vue'], resolve)
      },
      {
        path: '/stockStatus',
        name: 'stockStatus',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/shells/stockStatus.vue'], resolve)
      },
      {
        path: '/typeManage',
        name: 'typeManage',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/shells/typeManage.vue'], resolve)
      },
      {
        path: '/factoryManage',
        name: 'factoryManage',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/shells/factoryManage.vue'], resolve)
      },
      {
        path: '/stockAlarm',
        name: 'stockAlarm',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/shells/stockAlarm.vue'], resolve)
      },
      {
        path: '/configuration',
        name: 'configuration',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/configuration/site.vue'], resolve)
      },
      {
        path: '/alarm',
        name: 'alarm',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/alarm/index.vue'], resolve)
      },
      {
        path: '/gunMount',
        name: 'gunMount',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/gunMount/index.vue'], resolve)
      },
      {
        path: '/operationManage',
        name: 'operationManage',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationManage/index.vue'], resolve)
      },
      {
        path: '/gunManage',
        name: 'gunManage',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationManage/gunManage.vue'], resolve)
      },
      {
        path: '/communicationManage',
        name: 'communicationManage',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationManage/communicationManage.vue'], resolve)
      },
      {
        path: '/operateIntelligent',
        name: 'operateIntelligent',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationManage/operateIntelligent.vue'], resolve)
      },
      {
        path: '/operationRecord',
        name: 'operationRecord',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationManage/operationRecord.vue'], resolve)
      },
      {
        path: '/meteorologicalData',
        name: 'meteorologicalData',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationManage/meteorologicalData.vue'], resolve)
      },
      {
        path: '/log',
        name: 'log',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/log/index.vue'], resolve)
      },
      {
        path: '/workInfo',
        name: 'workInfo',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationInformation/sendNum.vue'], resolve)
      },
      {
        path: '/operationLocation',
        name: 'operationLocation',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationInformation/operationLocation.vue'], resolve)
      },
      {
        path: '/operationProcess',
        name: 'operationProcess',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationInformation/operationProcess.vue'], resolve)
      },
      {
        path: '/operationDistribution',
        name: 'operationDistribution',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationInformation/operationDistribution.vue'], resolve)
      },
      {
        path: '/operationalMeteorological',
        name: 'operationalMeteorological',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/operationInformation/operationalMeteorological.vue'], resolve)
      },
      {
        path: '/person',
        name: 'person',
        meta: {
          requireAuth: true,
          permission: []
        },
        component: resolve => require(['../view/person/index.vue'], resolve)
      }
    ]
  },
  {
    path: '/',
    name: 'login',
    component: resolve => require(['../page/login.vue'], resolve)
  },
  {
    path: '/password',
    name: 'password',
    component: resolve => require(['../page/pwd.vue'], resolve)
  },
  {
    path: '*',
    name: 'Page404',
    component: resolve => require(['../page/404.vue'], resolve)
  }
]

export default router
