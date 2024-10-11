<template>
  <div
    class="flex flex-col sm:flex-row justify-center mt-[50px] py-[50px] bg-gray w-full"
  >
    <div class="w-full h-full flex flex-col items-center justify-center px-8 md:px-16 xl:px-0 xl:w-1/2 md:flex-row md:gap-4">
      <NuxtImg src="/explore.svg" alt="Email Image" />
      <div class="flex flex-col items-center">
        <div class="mt-4 md:mt-0">
          <span
            v-for="(item, idx) in tm('exploreSection.description')"
            :key="idx"
            :class="`text-xl md:text-3xl ${idx % 2 == 0 ? 'text-primary font-bold' : ''}`"
          >
            {{ item }}
          </span>
        </div>
        <CustomBtn
          :title="t('exploreSection.button').toUpperCase()"
          :action="redirect"
          class="w-1/2 mt-4 bg-background"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, tm } = useI18n()
const router = useRouter()
const redirect = async () => {
  router.push('/events')
}
</script>
