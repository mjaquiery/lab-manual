<template>
  <div id="nav" class="p-4 w-full flex flex-row">
    <div class="flex pl-4 items-start flex-nowrap flex-col flex">
      <h1 class="tracking-widest font-extrabold uppercase">Blueprint</h1>
      <h4>Create your own lab manual</h4>
    </div>
    <div class="flex-1 items-center justify-end flex flex-row flex-nowrap mr-12">
      <router-link to="/" class="text-2xl mr-12">Home</router-link>
      <router-link to="/about" class="text-2xl mr-12">About</router-link>
      <router-link to="/howto" class="text-2xl mr-12">How to</router-link>
      <a href="https://github.com/mjaquiery/lab-manual" title="Open the project on Github" target="_blank">
        <img src="./assets/GitHub-Mark-32px.png">
      </a>
    </div>
  </div>
  <router-view/>
</template>

<style scoped>
a {
  @apply text-black 
}

a:hover {
  @apply border-b-2 border-black scale-y-0 transition duration-300 ease-in-out origin-right
}

a:active {
  @apply border-b-2 border-black 
}

 a.router-link-exact-active {
  @apply border-b-2 border-black 
 }
</style>
