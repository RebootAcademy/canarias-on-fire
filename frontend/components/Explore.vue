<template>
  <div class="flex justify-center mt-[50px] py-[50px] bg-gray w-full">
    <div class="w-1/2 h-full flex">
        <img src="/explore.svg" alt="Email Image">
      <div class="flex flex-col items-center">
        <div>
          <span 
            v-for="(item, idx) in tm('exploreSection.description')" 
            :key="idx"
            :class="`text-3xl ${idx % 2 == 0 ? 'text-primary font-bold' : ''}`"
          >
            {{ item }}
          </span>
        </div>
        <CustomBtn 
          :title="t('exploreSection.button').toUpperCase()"
          :action="redirect"
          class="w-1/2 mt-4"
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