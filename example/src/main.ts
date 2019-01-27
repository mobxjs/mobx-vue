import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router';

Vue.use(Router);

const router =  new Router({
  routes: [
    {
      path: "/",
      component: App
    }
  ]
});

new Vue({
  el: '#app',
  router,
  render: h => {
    return h(App)
  }
})
