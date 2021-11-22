import axios from 'axios'
import { createStore } from 'vuex'

const state = {
  // Template
  template_test: []
}

const mutations = {
  // Set chosen template
  LOAD_TEMPLATE: (state, template_test) => {
    state.template_test = template_test
  }
}

const actions = {
  // Read chosen template
  async getTemplate({commit}) {
    const response = await axios.get('./example.json')

    commit('LOAD_TEMPLATE', response.data)
  }
}

const modules = {

}

export default createStore({
  state,
  mutations,
  actions,
  modules
})
