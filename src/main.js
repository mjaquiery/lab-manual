import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import Oruga from '@oruga-ui/oruga-next'
// import { bulmaConfig } from '@oruga-ui/theme-bulma'

// import '@oruga-ui/theme-bulma/dist/bulma.css'
// import '@oruga-ui/oruga-next/dist/oruga.css'

createApp(App)
    // .use(Oruga, bulmaConfig)
    .use(router)
    .mount('#app')