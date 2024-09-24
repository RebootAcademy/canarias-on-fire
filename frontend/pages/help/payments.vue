<template>
  <div class="w-full flex flex-col items-center mt-4">
    <h2 class="text-xl mb-6">{{ $t('payments.title') }}</h2>
    <div class="flex flex-col items-start w-full">
      <DetailsQuestion
        v-for="question in paymentQuestions"
        :key="question.question"
        :question="question"
      />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

const paymentQuestions = computed(() => {
  return [
    {
      question: t('payments.question1.question'),
      answer: t('payments.question1.answer'),
    },
    {
      question: t('payments.question2.question'),
      answer: t('payments.question2.answer'),
    },
    {
      question: t('payments.question3.question'),
      answer: t('payments.question3.answer'),
    },
    {
      question: t('payments.question4.question'),
      answer: t('payments.question4.answer'),
    },
    {
      question: t('payments.question5.question'),
      answer: t('payments.question5.answer'),
    },
    {
      question: t('payments.question6.question'),
      answer: t('payments.question6.answer'),
    },
    {
      question: t('payments.question7.question'),
      answer: t('payments.question7.answer'),
    },
    {
      question: t('payments.question8.question'),
      answer: t('payments.question8.answer'),
    },
    {
      question: t('payments.question9.question'),
      answer: t('payments.question9.answer'),
    },
  ]
})

definePageMeta({
  layout: 'help-layout',
})
</script>
