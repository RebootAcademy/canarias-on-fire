<template>
<div class="w-full flex flex-col items-center mt-4">
    <h2 class="text-xl mb-6">{{ $t('accountManagement.title') }}</h2>
    <div class="flex flex-col items-start w-full">
      <DetailsQuestion
        v-for="question in accountManagementQuestions"
        :key="question.question"
        :question="question"
      />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

const accountManagementQuestions = computed(() => {
  return [
    {
      question: t('accountManagement.question1.question'),
      answer: t('accountManagement.question1.answer'),
    },
    {
      question: t('accountManagement.question2.question'),
      answer: t('accountManagement.question2.answer'),
    },
    {
      question: t('accountManagement.question3.question'),
      answer: t('accountManagement.question3.answer'),
    },
    {
      question: t('accountManagement.question4.question'),
      answer: t('accountManagement.question4.answer'),
    },
    {
      question: t('accountManagement.question5.question'),
      answer: t('accountManagement.question5.answer'),
    },
    {
      question: t('accountManagement.question6.question'),
      answer: t('accountManagement.question6.answer'),
    },
    {
      question: t('accountManagement.question7.question'),
      answer: t('accountManagement.question7.answer'),
    },
    {
      question: t('accountManagement.question8.question'),
      answer: t('accountManagement.question8.answer'),
    },
    {
      question: t('accountManagement.question9.question'),
      answer: t('accountManagement.question9.answer'),
    },
  ]
})

definePageMeta({
  layout: 'help-layout',
})
</script>
