<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100vh;
  background-color: #f8f8f8;
}
.flex-cc {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-c-bet {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-c-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
