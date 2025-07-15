<template>
  <div
    class="flex flex-col justify-center mt-[50px] py-[50px] rounded-lg bg-gray w-full md:px-8"
  >
    <div
      class="w-full h-full flex flex-col items-center justify-center px-8 md:px-16 xl:px-0 md:flex-row md:gap-4"
    >
      <img src="/explore.svg" alt="Email Image" />
      <div class="flex flex-col items-center">
        <div class="mt-4 md:mt-0">
          <span
            v-for="(item, idx) in tm('exploreSection.description')"
            :key="idx"
            :class="`text-xl md:text-3xl ${
              idx % 2 == 0 ? 'text-primary font-bold' : ''
            }`"
          >
            {{ item }}
          </span>
        </div>
        <CustomBtn
          :title="t('exploreSection.button').toUpperCase()"
          :action="redirect"
          :inverse="true"
          class="w-1/2 mt-4 bg-background"
        />
      </div>
    </div>
    <div class="flex items-center w-full mt-2">
      <div class="border-t border-primary flex-1"></div>
      <p class="text-center px-4 md:px-14">
        <span>{{ t('app.step1') }}</span> <br />
        <span>{{ t('app.step2') }}</span>
      </p>
      <div class="border-t border-primary flex-1"></div>
    </div>
    <div class="flex items-center justify-evenly mt-4">
      <img src="/qrApp.png" alt="qr image" class="w-32 h-32" />
    </div>
    <p class="mt-4 flex items-center">
      <img src="/v_logo.ico" alt="imagen logo evente" class="w-5 h-5 mr-1" />
      <span class="text-[7px] xs:text-[10px]">
        <span class="text-primary">{{ $t('responsability.title') }}</span>
        {{ $t('responsability.body') }}
      </span>
    </p>
  </div>
</template>

<script setup>
const { t, tm } = useI18n()
const router = useRouter()
const redirect = async () => {
  router.push('/events')
}
</script>
