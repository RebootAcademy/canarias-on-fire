<template>
    <div class="bg-primary-gradient p-0.5 rounded-md text-center">
        <div class="flex flex-col gap-2 bg-background  p-6 rounded-md min-w-[200px]">
          <p v-if="showTypeOfDiscount() !== ''">{{ $t('eventDiscount') }}:</p>
          <p class="font-bold">{{ showTypeOfDiscount() }}</p>
          <div v-if="event.categoriesOfServices?.length > 0">
              <p>{{ $t('eventServices') }}</p>
            <li v-for="(service, idx) in event.categoriesOfServices" :key="idx" class="text-sm text-gray-500 mt-2 font-bold">
              {{ $t(`values.${service}`) }}
            </li>
          </div>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps({
  event: {
    type: Object,
    default: () => {},
  },
})

const showTypeOfDiscount = () => {
  switch (props.event.eventDiscount) {
    case 'other':
      return t('eventTypeDiscount.other')
    case 'free':
      return t('eventTypeDiscount.free')
    case '10-30':
      return t('eventTypeDiscount.10-30')
    case '30-50':
      return t('eventTypeDiscount.30-50')
    case '50-70':
      return t('eventTypeDiscount.50-70')
    case '2x1':
      return t('eventTypeDiscount.2x1')
    default:
      return ''
  }
}
</script>
