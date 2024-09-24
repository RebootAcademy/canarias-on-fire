<template>
  <div class="w-full flex flex-col items-center mt-4">
    <h2 class="text-xl mb-6">{{ $t('general.title') }}</h2>
    <div class="flex flex-col items-start w-full">
      <DetailsQuestion
        v-for="question in questions"
        :key="question.question"
        :question="question"
      />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const questions = computed(() => {
  return [
    {
      question: t('general.question1.question'),
      answer: t('general.question1.answer'),
    },
    {
      question: t('general.question2.question'),
      answer: t('general.question2.answer'),
    },
    {
      question: t('general.question3.question'),
      answer: t('general.question3.answer'),
    },
    {
      question: t('general.question4.question'),
      answer: t('general.question4.answer'),
    },
    {
      question: t('general.question5.question'),
      answer: t('general.question5.answer'),
    },
    {
      question: t('general.question6.question'),
      answer: t('general.question6.answer'),
    },
    {
      question: t('general.question7.question'),
      answer: t('general.question7.answer'),
    },
    {
      question: t('general.question8.question'),
      answer: t('general.question8.answer'),
    },
    {
      question: t('general.question9.question'),
      answer: t('general.question9.answer'),
    },
  ]
})

definePageMeta({
  layout: 'help-layout',
})
</script>
