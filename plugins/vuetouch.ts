import Vue3TouchEvents from "vue3-touch-events";

export default defineNuxtPlugin((nuxtApp) => {
// 	Vue3TouchEvents.registerCustomEvent("doubletap", {
//     type: "tap",
//     taps: 2,
//   });
  nuxtApp.vueApp.use(Vue3TouchEvents);
});
