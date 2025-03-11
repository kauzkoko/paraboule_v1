<template>
  <div>
      <template v-for="route in routes" :key="route.path">
          <NuxtLink noPrefetch :to="route.path">
              <li>
                  {{ route.path.replaceAll("%20", " ") }}
              </li>
          </NuxtLink>
      </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const routes = router.getRoutes();
routes.sort((a, b) => a.path.length - b.path.length);
</script>

<style>
li {
    font-size: 40px;
    list-style: none;
    margin: 0;
    padding: 0;
    color: white;
}

a {
    text-decoration: none;
}

a:visited li {
    color: gray;
}
</style>