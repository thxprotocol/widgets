import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        component: () => import('../views/Claim.vue'),
    },
    {
        path: '/claim',
        component: () => import('../views/Claim.vue'),
    },
    {
        path: '/collect',
        component: () => import('../views/Collect.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

export default router;
