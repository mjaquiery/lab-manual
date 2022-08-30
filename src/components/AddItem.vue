<template>
    <div class="addItem">
        <form @submit="onSubmit" class="flex flex-col mt-5">
            <input type="text" v-model="title" @blur="v$.title.$touch" placeholder="add title..." class="mb-2">
            <span class="flex justify-center text-gray-500 mb-2" v-if="v$.title.$error"> providing title is required </span>
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
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

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
    setup: () => ({ v$: useVuelidate() }),
    validations() {
        return {
            // Given a title to the new item is required
            title: { required }
        }
    },
    methods: {
        ...mapActions(['addItem']),
        onSubmit: function (e) {
            e.preventDefault()

            // Close addItemSkeleton in parent component
            this.$parent.showAddItemSkeleton = false
            // run the validation
            this.v$.title.$touch()

            // only create new item if all validations are valid
            if (!this.v$.title.$error) {
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
}
</script>

<style scoped>

</style>