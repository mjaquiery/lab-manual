import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import TemplateString
  from './components/TemplateString'
import TemplateOptions from './components/TemplateOptions'
import store from './store'

import './index.css'

// import Oruga from '@oruga-ui/oruga-next'
// import { bulmaConfig } from '@oruga-ui/theme-bulma'

// import '@oruga-ui/theme-bulma/dist/bulma.css'
// import '@oruga-ui/oruga-next/dist/oruga.css'


const app = createApp(App)
    .use(store)
    // .use(Oruga, bulmaConfig)
    .use(router)
    .component('TemplateString', TemplateString)
    .component('TemplateOptions', TemplateOptions)

app.mount('#app')

console.log(app._context)
