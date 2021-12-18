<template>
  <div class="home">
    <Sidebar>
     <ul class="sidebar-panel-nav">
     </ul>
   </Sidebar>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <div class="manual">
      <section v-if="errorLoadingTemplate">
        <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
      </section>
      <section v-else>
        <div v-if="loadingTemplate">Loading...</div>
        <Item
          v-else
          v-for="I in getRootObj.content.contents"
          :itemId="I"
          :key="I"
          :level=1
        />
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Sidebar from '@/components/Sidebar.vue'
import { mapActions, mapState, mapGetters } from 'vuex'

import Item from '@/components/Item.vue'

export default {
  name: 'Home',
  components: { 
    // Item,
    Item,
    Sidebar
  },
  data: function () {
    return {
      // dataSource: './example.json',
      // template
    }
  },
  computed: {
    ...mapState(['flat', 'errorLoadingTemplate', 'loadingTemplate']),
    ...mapGetters(['getRootObj'])
  },
  methods: {
    ...mapActions(['getTemplate'])
  },
  mounted() {
    // Get template on load
    this.getTemplate()
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
