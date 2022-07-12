<template>
  <div id="nav" class="top-0 p-4 w-full flex flex-row">
    <div class="flex-1 pr-12 justify-start items-center">
      <h1 class="pr-3">Blueprint</h1>
      <h2>Create your own lab manual</h2>
    </div>
    <div class="flex-1 items-center justify-center">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
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
  @apply flex-1 flex-col h-full;
/*   @apply w-full flex flex-col flex-wrap py-4 flex-grow; */
  /* @apply sm:flex-row sm:flex-nowrap */
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

h1 {@apply space-y-4 text-4xl !important}
h2 {@apply space-y-2 text-2xl !important}
h3 {@apply space-y-1 text-xl !important}
h4 {@apply space-y-1 text-base !important}
</style>
