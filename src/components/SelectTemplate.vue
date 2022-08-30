<template>
    <h2 class="ml-2 mb-2">Template options</h2>
    <p v-if="!loadingTemplate" class="text-bold mb-4">Beware that by loading a new template will lead to the loss of previous
        progress!</p>
    <div class="flex flex-col items-center">
        <form action="#" class="ml-2">
            <label for="fmt" class="mr-2 mb-2">Select template:</label>
            <select name="output_formats" id="fmt" class="rounded-md mb-6 bg-blue-300 bg-opacity-50 p-1"
                v-model="selectedTemplate">
                <option value="" disabled selected hidden>Please select a template</option>
                <option v-for="(template, i) in this.templateList" :key="i" :value="`${template.template}`"
                    :title="`${template.usecase}`">
                    {{ template.title }}
                </option>
            </select>
        </form>
        <button @click="loadTemplate" :disabled="this.selectedTemplate === '' ? true : false"
            class="disabled-btn rounded-md p-2 bg-blue-300 bg-opacity-50 flex flex-row font-bold">
            <span>Load {{ loadingTemplate ? '' : 'new' }} template</span>
        </button>
        <button v-if="!loadingTemplate" @click="this.$store.commit('TEMPLATE_MODAL_TOGGLE', false)"
            class="disabled-btn rounded-md p-2 bg-blue-300 bg-opacity-50 flex flex-row font-bold mt-2">
            <span>Keep current progress</span>
        </button>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    name: 'SelectTemplate',
    data: function () {
        return {
            selectedTemplate: ''
        }
    },
    computed: {
        ...mapState(['loadingTemplate', 'templateList', 'isTemplateModalActive'])
    },
    methods: {
        ...mapActions(['getTemplate', 'getTemplateList']),
        loadTemplate: function () {
            this.$store.commit('TEMPLATE_MODAL_TOGGLE', false)
            this.getTemplate(this.selectedTemplate)
        }
    },
    mounted() {
        // Get templateList on load
        this.getTemplateList()
        //this.selectedTemplate = this.templateList[0].template
    }
}
</script>