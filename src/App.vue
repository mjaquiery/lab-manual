<template>
  <div id="nav" class="top-0 p-4 w-full flex flex-row">
    <div class="flex pr-12 items-start flex-nowrap flex-col flex">
      <h1 class="tracking-widest font-extrabold">Blueprint</h1>
      <h4>Create your own lab manual</h4>
    </div>
    <div class="flex-1 items-center justify-end flex flex-row flex-nowrap">
      <router-link to="/" class="text-2xl pr-12">Home</router-link>
      <router-link to="/about" class="text-2xl pr-12">About</router-link>
      <img src="./assets/GitHub-Mark-32px.png" class="pb-2">
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
  color: #25405c;
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
