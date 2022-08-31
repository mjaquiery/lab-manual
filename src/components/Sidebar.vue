<template>
    <div class="h-full flex flex-row">
        <div class="pt-6 pr-5 pb-8 pl-5 z-auto overflow-y-auto bg-blue-500 items-center flex-col flex rounded-tr-lg"
            v-if="isPanelOpen">
            <slot></slot>
        </div>
        <BurgerButton @clicked="onClicked"></BurgerButton>
    </div>
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

</style>