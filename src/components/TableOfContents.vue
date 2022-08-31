<template>
    <ul>
        <li class="pb-3 text-lg" v-for="(title, i) in this.getTitles" :key="i">
            <a :href="`#${title}`">
                {{ title }}
            </a>
        </li>
    </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'TableOfContents',
    computed: {
        ...mapGetters(['getTitles'])
    }
}
</script>