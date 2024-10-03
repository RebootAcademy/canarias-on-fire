<template>
  <div class="flex flex-col p-6 items-center justify-center mt-[50px] py-[50px] bg-gray w-full">
    <img src="/newsletter.svg" alt="Email Image">
    <h1 class="text-primary text-4xl my-10 font-bold">
      {{  $t('newsletter.title') }}
    </h1>
    <p class="text-xl">
      {{ $t('newsletter.description') }}
    </p>
    <div class="flex flex-col w-full px-6 gap-2 md:gap-0 md:px-0 md:flex-row md:w-1/2 mt-[50px] justify-between">
      <Input
          id="subscribeNewsletter"
          type="text"
          v-model="email"
          class="p-2 border-2 border-grayForeground rounded-md w-full md:w-4/5"
          :placeholder="$t('newsletter.placeholder')"
        />
      <CustomBtn 
        :title="$t('newsletter.button').toUpperCase()" 
        :action="subscribe" 
        extraStyles="w-[110px]"
      />
    </div>
  </div>
</template>

<script setup>
  import { useToast } from '@/components/ui/toast/use-toast'

  const store = useUserStore()
  const { toast } = useToast()
  const { t } = useI18n()

  const email = ref('')

  const subscribe = async () => {
    const result = await store.subscribeToNewsletter(email.value)
    toast({
      description: result ? t('newsletter.success') : t('newsletter.error'),
      variant: result ? '' : 'destructive',
      position: 'top-right',
    })
  }
</script>
