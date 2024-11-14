<template>
    <p class="font-bold text-2xl">{{ $t('areYouSure') }}</p>
    <p class="text-lg">
      {{ type === 'event' ? $t('deleteAllEventClosed') : $t('deleteAllPromotionClosed') }}
    </p>
    <div class="flex justify-end gap-4 mt-2">
      <button
        @click="closeModal"
        class="font-bold p-2 px-6 rounded-md bg-gray hover:bg-red-500"
      >
        {{ $t('buttons.cancel') }}
      </button>
      <CustomBtn :title="$t('buttons.confirm')" @click="deleteAll" />
    </div>
</template>

<script setup>
import { toast } from './ui/toast'

const { t } = useI18n()
const eventStore = useEventStore()
const userStore = useUserStore()
const emit = defineEmits(['update:open'])
const props = defineProps({
    type: {
        type: String,
        default: 'event'
    },
})


const closeModal = () => {
  emit('update:open', false) 
}

const deleteAll = async () => {
  const result = await eventStore.deleteAllMyClosedEvents(userStore.userData._id, props.type)

  if (result.success) {
    toast({
      description:
        props.type === 'event'
          ? t('deleteAllEventsSuccess')
          : t('deleteAllPromotionsSuccess'),
    })
  } else {
    toast({
      description:
        props.type === 'event'
          ? t('errorDeleteClosedEvents')
          : t('errorDeleteClosedPromotions'),
    })
  }
  emit('update:open', false)
}
</script>

