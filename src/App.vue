<template>
  <div id="nav" class="top-0 p-4 w-full flex flex-row">
    <div class="flex-1 pr-12 justify-start items-center flex-nowrap flex-row flex">
      <h1 class="pr-3">Blueprint</h1>
      <h2 class="pt-2">Create your own lab manual</h2>
    </div>
    <div class="flex-1 items-center justify-start flex flex-row flex-nowrap">
      <router-link to="/" class="text-xl pr-12">Home</router-link>
      <br>
      <router-link to="/about" class="text-xl">About</router-link>
    </div>
    <div>
      <img src="./assets/GitHub-Mark-32px.png">
    </div>
  </div>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  @apply flex flex-col h-screen;
}

#nav a {
/*   font-weight: bold;
  color: #2c3e50; */
}

#nav a.router-link-exact-active {
/*   color: #42b983; */
}

h1 {@apply space-y-4 text-4xl !important}
h2 {@apply space-y-2 text-2xl !important}
h3 {@apply space-y-1 text-xl !important}
h4 {@apply space-y-1 text-base !important}
</style>
