<template>
  <div class="overflow-y-auto h-screen">
    <NuxtLink noPrefetch to="/">
      <li>/</li>
    </NuxtLink>
    <NuxtLink noPrefetch to="/">
      <li>/exhibition app</li>
    </NuxtLink>
    <template v-for="(route, index) in routes" :key="route.path">
      <NuxtLink
        v-if="
          !route.path.startsWith('/archive') &&
          !route.path.startsWith('/protoboules') &&
          index > 1
        "
        noPrefetch
        :to="route.path"
      >
        <li>
          {{ route.path.replaceAll("%20", " ") }}
        </li>
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
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
