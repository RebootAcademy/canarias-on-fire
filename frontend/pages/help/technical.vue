<template>
  <div class="w-full flex flex-col items-center mt-4">
    <h2 class="text-lg md:text-xl lg:text-2xl opacity-70  mb-6">{{ $t('technicalIssues.title') }}</h2>
    <div class="flex flex-col items-start w-full">
      <DetailsQuestion
        v-for="question in technicalIssuesQuestions"
        :key="question.question"
        :question="question"
      />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const supportEmail = "soporte@eventos.com"
const technicalIssuesQuestions = computed(() => {
  return [
    {
      question: t('technicalIssues.question1.question'),
      answer: t('technicalIssues.question1.answer'),
    },
    {
      question: t('technicalIssues.question2.question'),
      answer: t('technicalIssues.question2.answer'),
    },
    {
      question: t('technicalIssues.question3.question'),
      answer: t('technicalIssues.question3.answer'),
    },
    {
      question: t('technicalIssues.question4.question'),
      answer:  t('technicalIssues.question4.answer')
    },
    {
      question: t('technicalIssues.question5.question'),
      answer: t('technicalIssues.question5.answer'),
    },
   /*  {
      question: t('technicalIssues.question6.question'),
      answer: t('technicalIssues.question6.answer'),
    }, */
  /*   {
      question: t('technicalIssues.question7.question'),
      answer: t('technicalIssues.question7.answer'),
    }, */
    {
      question: t('technicalIssues.question8.question'),
      answer: t('technicalIssues.question8.answer'),
    },
    {
      question: t('technicalIssues.question9.question'),
      answer: t('technicalIssues.question9.answer'),
    },
  ]
})

definePageMeta({
  layout: 'help-layout',
})
</script>
