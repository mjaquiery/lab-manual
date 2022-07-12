<template>
  <div id="nav" class="top-0 p-4 w-full h-full">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
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
