<template>
  <div class="flex flex-col items-center justify-center mt-[50px] py-[50px] bg-gray w-full">
    <img src="/newsletter.svg" alt="Email Image">
    <h1 class="text-primary text-4xl my-10 font-bold">
      {{  $t('newsletter.title') }}
    </h1>
    <p class="text-xl">
      {{ $t('newsletter.description') }}
    </p>
    <div class="flex w-1/2 mt-[50px] justify-between">
      <Input
          id="subscribeNewsletter"
          type="text"
          v-model="email"
          class="p-2 border rounded-md w-4/5"
          :placeholder="$t( 'newsletter.placeholder')"
        />
      <CustomBtn :title="$t('newsletter.button').toUpperCase()" :action="subscribe" extraStyles="w-[110px]"/>
    </div>
    <p
      v-if="message"
      class="text-xl mt-4"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup>
const store = useUserStore()
const { t } = useI18n()
  const email = ref('')
  const message= ref('')
  const subscribe = async () => {
    const result = await store.subscribeToNewsletter(email.value)
    message.value = result ? t('newsletter.success') : t('newsletter.error')
  }
</script>