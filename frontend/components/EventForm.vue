<template>
  <div class="flex flex-col mt-4 gap-4">
    <VeeForm @submit="onSubmit">
      <EventInfoForm />
      <CategorySelector />
      <VeeErrorMessage name="selectedCategories" class="text-red-500 text-xs" />
      <Button type="submit">{{ $t('preview') }}</Button>
    </VeeForm>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { useRouter } from 'vue-router'
import { useForm, defineRule, configure } from 'vee-validate'
import { required } from '@vee-validate/rules'
import * as yup from 'yup'

const eventStore = useEventStore()
const router = useRouter()

defineRule('required', required)

configure({
  generateMessage: context => {
    return `${context.field} required`
  }
})

const schema = yup.object({})

const { handleSubmit } = useForm({
  validationSchema: schema
})

const onSubmit = handleSubmit((values) => {
  eventStore.status = 'draft'

  console.log('Form data:', values)

  router.push({
    name: 'event-preview'
  })
})

</script>