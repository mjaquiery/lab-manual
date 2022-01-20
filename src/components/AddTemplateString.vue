<template>
    <div class="addTemplateString">
        <form @submit="onSubmit">
            <textarea
                rows = "3"
                cols = "30"
                name = "option"
                placeholder="enter text of the option here..."
                v-model="optionText"
            >
            </textarea>
            <button type="submit"> Submit </button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'AddTemplateString',
    props: {
        itemId: {type: Number, default: null}
    },
    data() {
        return {
            optionText: ''
        }
    },
    methods: {
        onSubmit: function (e) {
            e.preventDefault()
            
            const payload = {
                'itemId': this.itemId,
                'optionText' : this.optionText 
            }
            console.log({'itemid': this.itemId, 'option': this.optionText})
            this.$store.commit('ADD_TEMPLATESTRING', payload)
        }
    }
}
</script>

<style scoped>

</style>