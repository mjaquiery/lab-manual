<template>
    <div class="addItem">
        <form @submit="onSubmit" class="flex flex-col mt-5">
            <input type="text" v-model="title" placeholder="add title..." class="mb-2">
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
            <button type="submit" class="submit mt-2 mb-2"> Submit </button>
        </form>
    </div>
</template>

<script>
// import AddTemplateString from '@/components/AddTemplateString'
import { mapGetters, mapActions } from 'vuex'

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
        ...mapActions(['addItem']),
        onSubmit: function (e) {
            e.preventDefault()
            console.log(this.parentItemId)
            const payload = {
                'parentItemId': this.parentItemId,
                'itemId': this.getNewId,
                'description' : this.description,
                'title': this.title
            }
            this.addItem(payload)
        }
    }
}
</script>

<style scoped>

</style>