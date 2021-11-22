<template>
  <div class="home">
    <Sidebar>
     <ul class="sidebar-panel-nav">
     </ul>
   </Sidebar>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <div class="manual">
      <Item v-for="(I, index) in template.contents" :template="I" :key="index"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Item from '@/components/Item.vue'
import template from '@/assets/example.json'
import Sidebar from '@/components/Sidebar.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    Item,
    Sidebar
  },
  data: function () {
    return {
      dataSource: './example.json',
      template
    }
  }, 
  computed: {
    ...mapState(['template_test'])
    },
  methods: {
    ...mapActions(['getTemplate'])
  },
  mounted() {
    // Get template on load
    this.getTemplate();
  }
}
</script>

<style scoped>
.home {
  display: flex;
  /* position: relative; */
}

.manual {
  /* flex-direction: column; */
  flex: 1;
}
</style>