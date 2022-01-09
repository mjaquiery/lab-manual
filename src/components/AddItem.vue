<template>
    <div class="addItem">
        <form @submit="onSubmit">
            <input type="text" v-model="title" placeholder="add title...">
            <textarea
                rows = "3"
                cols = "30"
                name = "description"
                placeholder="add description..."
                v-model="description"
            >
            </textarea>
    <!-- <AddTemplateString
      :itemId="itemId"
    /> -->
            <button type="submit"> Submit </button>
        </form>
    </div>
</template>

<script>
// import AddTemplateString from '@/components/AddTemplateString'
import { mapGetters } from 'vuex'

export default {
    name: 'AddItem',
    components: {
        // AddTemplateString
    },
    props: {
        parentItemId: {type: Number, default: null}
    },
    computed: {
        ...mapGetters(['getNewId'])
    },
    data() {
        return {
            title: '',
            description: ''
        }
    },
    methods: {
        onSubmit: function (e) {
            e.preventDefault()
            console.log(this.parentItemId)
            const payload = {
                'parentItemId': this.parentItemId,
                'itemId': this.getNewId,
                'description' : this.description,
                'title': this.title
            }
            this.$store.commit('ADD_ITEM', payload)
        }
    }
}
</script>

<style scoped>

</style>