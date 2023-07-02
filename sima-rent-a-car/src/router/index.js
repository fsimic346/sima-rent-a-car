import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView,
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue"),
        meta: {
            requiresNoAuth: true,
        },
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/Register.vue"),
        meta: {
            requiresNoAuth: true,
        },
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import("../views/Profile.vue"),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/user/:username",
        name: "user",
        component: () => import("../views/User.vue"),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/agencies",
        name: "agencies",
        component: () => import("../views/Agencies.vue"),
    },
    {
        path: "/agency/:agencyId",
        name: "agency",
        component: () => import("../views/Agency.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!localStorage.getItem("user")) {
            next({
                path: "/login",
                params: { nextUrl: to.fullPath },
            });
            return;
        }
    }
    if (to.matched.some(record => record.meta.requiresNoAuth)) {
        console.log(localStorage.getItem("user"));
        if (localStorage.getItem("user")) {
            next({
                path: "/profile",
                params: { nextUrl: to.fullPath },
            });
            return;
        }
    } else {
        next();
    }
});

export default router;
