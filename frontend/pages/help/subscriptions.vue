<template>
  <div class="w-full flex flex-col items-center mt-4">
    <h2 class="text-lg md:text-xl lg:text-2xl opacity-70  mb-6">{{ $t('subscriptions.title') }}</h2>
    <div class="flex flex-col items-start w-full">
      <DetailsQuestion
        v-for="question in subscriptionQuestions"
        :key="question.question"
        :question="question"
      />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const subscriptionQuestions = computed(() => {
  return [
    {
      question: t('subscriptions.question1.question'),
      answer: t('subscriptions.question1.answer'),
    },
    {
      question: t('subscriptions.question2.question'),
      answer: t('subscriptions.question2.answer'),
    },
    {
      question: t('subscriptions.question3.question'),
      answer: t('subscriptions.question3.answer'),
    },
    {
      question: t('subscriptions.question4.question'),
      answer: t('subscriptions.question4.answer'),
    },
   /*  {
      question: t('subscriptions.question5.question'),
      answer: t('subscriptions.question5.answer'),
    }, */
    {
      question: t('subscriptions.question6.question'),
      answer: t('subscriptions.question6.answer'),
    },
    /* {
      question: t('subscriptions.question7.question'),
      answer: t('subscriptions.question7.answer'),
    }, */
   /*  {
      question: t('subscriptions.question8.question'),
      answer: t('subscriptions.question8.answer'),
    }, */
    {
      question: t('subscriptions.question9.question'),
      answer: t('subscriptions.question9.answer'),
    },
  ]
})

definePageMeta({
  layout: 'help-layout',
})
</script>
