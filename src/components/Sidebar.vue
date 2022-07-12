<template>
    <div class="flex-auto flex-grow-0 flex-shrink-0 flex-col">
        <transition name="slide">
            <div 
            v-if="isPanelOpen"
            class="sidebar-panel"
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
            isPanelOpen: false
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
    transition: all 150ms ease-in 0s
}

.sidebar-panel {
    overflow-y: auto;
    background-color: #130f40;
    position: relative;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 999;
    padding: 3rem 20px 2rem 20px;
}
</style>