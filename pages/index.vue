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
</script>
