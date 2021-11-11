import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import TemplateString
  from './components/TemplateString'
import TemplateOptions from './components/TemplateOptions'

const app = createApp(App)
  .use(router)
  .component('TemplateString', TemplateString)
  .component('TemplateOptions', TemplateOptions)

app.mount('#app')

console.log(app._context)
