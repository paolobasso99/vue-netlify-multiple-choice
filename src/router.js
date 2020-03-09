import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';

import Quiz from '@/views/Quiz';
import Launcher from '@/views/Launcher';
import End from '@/views/End';
import AccessDenied from '@/views/AccessDenied';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'launcher',
            component: Launcher
        },
        {
            path: '/denied',
            name: 'AccessDenied',
            component: AccessDenied,
            meta: {
                notProtected: true
            }
        },
        {
            path: '/quiz/:howMany',
            name: 'quiz',
            component: Quiz,
            props: function(route) {
                return {
                    howMany: Number(route.params.howMany),
                }
            }
        },
        {
            path: '/end',
            name: 'end',
            component: End,
            props: true
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.notProtected != true) { // This route is protected
        const verified = await axios.get('/.netlify/functions/verify?key='+to.query.key);

        if(verified.data !== "verified") {
            next({
                path: '/denied'
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
