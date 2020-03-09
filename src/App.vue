<template>
  <section class="hero">
    <div class="hero-body">
      <div id="app" class="container">
        <div class="box">
          <h1 class="title">{{appName}}</h1>
          
          <router-view/>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'app',
  
  data() {
    return {
      appName: process.env.VUE_APP_NAME
    }
  }
}
</script>
