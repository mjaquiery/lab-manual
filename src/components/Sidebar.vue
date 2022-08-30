<template>
    <div
        :class="isPanelOpen? 'flex-1/6' : 'flex'" >
        <transition name="slide">
            <div 
            v-if="isPanelOpen"
            class="h-full pt-6 pr-5 pb-8 pl-5 z-auto left-0 top-0 overflow-y-auto bg-blue-500 items-center flex-col flex rounded-tr-lg"
                 >
                <slot></slot>
            </div>
        </transition>
        </div>
    <BurgerButton @clicked="onClicked"></BurgerButton>
</template>
<script>
import BurgerButton from '@/components/BurgerButton.vue'

export default {
    name: 'Sidebar',
    components: {
        BurgerButton,
    },
    data() {
        return{
            isPanelOpen: true
        }
    },
    methods: {
        onClicked(value) {
            this.isPanelOpen = value
        }
    }
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
    transition: transform 0.5s ease;
}

 .slide-enter, .slide-leave-to {
    transform: translateX(-100%);
    transition: all 150ms ease-in 0s;
}
</style>