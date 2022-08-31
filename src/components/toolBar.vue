<template>
    <div class="flex flex-col items-center">
        <div class="flex flex-row w-full bg-gray-300 rounded-bl-lg rounded-br-lg" v-if="isToolbarActive">
            <button @click="this.$store.commit('TEMPLATE_MODAL_TOGGLE', true)"
                class="font-extrabold m-2 text-xl rounded-2xl bg-blue-500 text-white p-2"
                title="Select a new lab manual template">Template</button>
            <o-modal v-model:active="isTemplateModalActive" :canCancel="['button']">
                <SelectTemplate />
            </o-modal>
            <button @click="isDownloadModalActive = true"
                class="font-extrabold text-xl mb-2 mt-2 mr-2 rounded-2xl bg-blue-500 text-white p-2"
                title="Download your lab manual">Download</button>
            <o-modal v-model:active="isDownloadModalActive">
                <DownloadButton />
            </o-modal>
        </div>
        <ChevronDownIcon class="h-8 w-8 cursor-pointer" @click="toggleToolbar" v-if="!isToolbarActive"/>
        <ChevronUpIcon class="h-8 w-8 cursor-pointer" @click="toggleToolbar" v-else/>
    </div>
</template>

<script>
import SelectTemplate from './SelectTemplate.vue';
import DownloadButton from './DownloadButton.vue';
import { mapState } from 'vuex'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/solid'

export default {
    name: 'toolBar',
    components: {
        DownloadButton,
        SelectTemplate,
        ChevronDownIcon,
        ChevronUpIcon
    },
    data: function() {
        return {
            isDownloadModalActive: false,
            isToolbarActive: true
        }
    },
    computed: {
        ...mapState(['isTemplateModalActive'])
    },
    methods: {
        toggleToolbar: function () {
            this.isToolbarActive = !this.isToolbarActive
        }
    }
}
</script>