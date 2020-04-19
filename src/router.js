import Vue from "vue";
import Router from "vue-router";

import Quiz from "@/views/Quiz";
import Launcher from "@/views/Launcher";
import End from "@/views/End";

import endRedirect from "@/middleware/endRedirect";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "launcher",
      component: Launcher,
    },
    {
      path: "/quiz/:howMany",
      name: "quiz",
      component: Quiz,
      props: function(route) {
        return {
          howMany: String(route.params.howMany),
        };
      },
    },
    {
      path: "/end",
      name: "end",
      component: End,
      props: true,
      beforeEnter: (to, from, next) => {
        endRedirect(to, from, next);
      },
    },
  ],
});

export default router;
