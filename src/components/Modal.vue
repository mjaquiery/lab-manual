<template>
  <transition name="fade">
    <div class="modal overflow-x-hidden overflow-x-auto flex justify-center items-center fixed inset-0" v-if="show">
      <div class="backdrop bg-black fixed inset-0 z-10 bg-opacity-20" @click="closeModal()"/>

      <div class="dialog relative w-1/4 bg-white rounded-lg mb-auto z-20 flex flex-col">
        <div class="header flex flex-row justify-center mb-2 mt-2 mr-2 ml-2">
          <slot name="header"/>
        </div>

        <div class="body overflow-auto flex flex-col items-stretch mb-2 mr-2 ml-2">
          <slot name="body"/>
        </div>

        <div class="footer ml-2 mr-2 mb-2 flex flex-row justify-end">
          <slot name="footer"/>
          <XCircleIcon @click="closeModal()" class="icon-btn" /> 
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { XCircleIcon } from '@heroicons/vue/solid'

export default {
  name: 'Modal',
  components: {
    XCircleIcon
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    closeModal() {
      this.show = false;
      document.querySelector("body").classList.remove("overflow-hidden");
    },
    openModal() {
      this.show = true;
      document.querySelector("body").classList.add("overflow-hidden");
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>