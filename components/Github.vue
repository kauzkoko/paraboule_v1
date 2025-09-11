<template>
  <div
    class="fixed top-0 left-0 m-5 mt-4 z-999999999999999999"
    v-show="!store.infoScreen"
  >
    <div class="text-white max-w-25dvw hidden md:block">
      <div class="mb-3">
        PARABOULE is an assistive system that enables visually impaired players
        to play Boule. It is designed and developed for (Android) smartphones with touchscreen,
        AR-capabilities, haptic feedback and spatial audio. Support for other
        devices is limited. The use of headphones is highly recommended.
      </div>
      <a
        href="https://github.com/kauzkoko/paraboule"
        class="no-underline flex flex-row items-center"
        @click.prevent="visitLink"
        @keydown.enter.prevent="visitLink"
        role="link"
        tabindex="0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <!-- Icon from Grommet Icons by Grommet - https://www.apache.org/licenses/LICENSE-2.0 -->
          <path
            fill="white"
            fill-rule="evenodd"
            d="M11.999 1C5.926 1 1 5.925 1 12c0 4.86 3.152 8.983 7.523 10.437c.55.102.75-.238.75-.53c0-.26-.009-.952-.014-1.87c-3.06 .664-3.706-1.475-3.706-1.475c-.5-1.27-1.221-1.61-1.221-1.61c-.999-.681.075-.668.075-.668c1.105.078 1.685 1.134 1.685 1.134c.981 1.68 2.575 1.195 3.202.914c.1-.71.384-1.195.698-1.47c-2.442-.278-5.01-1.222-5.01-5.437c0-1.2.428-2.183 1.132-2.952c-.114-.278-.491-1.397.108-2.91c0 0 .923-.297 3.025 1.127A10.5 10.5 0 0 1 12 6.32a10.5 10.5 0 0 1 2.754.37c2.1-1.424 3.022-1.128 3.022-1.128c.6 1.514.223 2.633.11 2.911c.705.769 1.13 1.751 1.13 2.952c0 4.226-2.572 5.156-5.022 5.428c.395.34.747 1.01.747 2.037c0 1.47-.014 2.657-.014 3.017c0 .295.199.637.756.53C19.851 20.979 23 16.859 23 12c0-6.075-4.926-11-11.001-11"
          />
        </svg>
        <div class="text-white ml-2">Find source code on Github</div>
      </a>
      <a
        href="https://github.com/kauzkoko/paraboule"
        class="no-underline flex flex-row items-center mt-3"
        @click.prevent="visitLinkZhdk"
        @keydown.enter.prevent="visitLinkZhdk"
        role="link"
        tabindex="0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <!-- Icon from Grommet Icons by Grommet - https://www.apache.org/licenses/LICENSE-2.0 -->
          <path
            fill="none"
            stroke="white"
            stroke-width="2"
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Zm0-12v8m0-12v2"
          />
        </svg>
        <div class="text-white ml-2">Learn more about the project</div>
      </a>
    </div>
  </div>
  <div
    class="fixed top-0 right-0 m-5 mt-4 z-999999999999999999"
    v-show="!store.infoScreen"
  >
    <div class="mt-0 text-white max-w-20dvw hidden md:block">
      Controls on non-touchscreen devices:
      <ul class="pl-5 mt-2 children:my-2">
        <li>
          Use <strong>← / → arrow keys</strong> or
          <strong>number keys (1–9)</strong> to move between buttons.
        </li>
        <li><strong>Click</strong> → activate button</li>
        <li><strong>Press &amp; hold</strong> → hear button description</li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
const visitLink = () => {
  const url = "https://github.com/kauzkoko/paraboule";
  try {
    window.open(url, "_blank", "noopener");
  } catch (e) {
    window.location.href = url;
  }
};

const visitZhdk = () => {
  const url =
    "https://interactiondesign.zhdk.ch/diploma-2025/projekte/paraboule/";
  try {
    window.open(url, "_blank", "noopener");
  } catch (e) {
    window.location.href = url;
  }
};

const store = useProtoStore();
</script>

<style scoped>
div {
  @apply xl:text-22px;
}
</style>
