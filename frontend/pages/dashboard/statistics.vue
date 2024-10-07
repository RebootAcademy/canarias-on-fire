<template>
  <div class="p-6">
    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
      <StatCard
        :title="$t('statisticsSection.totalUsers')"
        :value="users.usersThisMonth"
        icon="users"
        :change="isPositive(users.difference)"
      />
      <StatCard
        :title="$t('statisticsSection.totalCompanies')"
        :value="users.companiesThisMonth"
        icon="users"
        :change="isPositive(users.companiesDifferences)"
      />

      <StatCard
        :title="$t('statisticsSection.totalBands')"
        :value="users.bandsThisMonth"
        icon="users"
        :change="isPositive(users.bandsDifferences)"
      />

      <StatCard
        :title="$t('statisticsSection.totalSubscriptions')"
        :value="subscriptionDifference.currentMonthSubscriptions"
        :change="isPositive(subscriptionDifference.difference)"
        icon="users"
      />
      <StatCard
        :title="$t('statisticsSection.totalEvents')"
        :value="eventsActives.eventsActives"
        :change="isPositive(eventsActives.difference)"
        icon="shopping-cart"
      />
    </div>

    <div class="p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">
        {{ $t('statisticsSection.label') }}
      </h2>
      <OverviewChart />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const userStore = useUserStore()
const eventStore = useEventStore()

const users = computed(() => {
  let usersData = {
    usersThisMonth: 0,
    usersLastMonth: 0,
    difference: 0,
    companiesThisMonth: 0,
    companiesLastMonth: 0,
    companiesDifferences: 0,
    bandsThisMonth: 0,
    bandsLastMonth: 0,
    bandsDifferences: 0,
  }

  userStore.users.forEach((user) => {
    const currentDate = new Date()
    const previousMonthDate = new Date()
    previousMonthDate.setMonth(currentDate.getMonth() - 1)
    let isCompany = user.role === 'company'
    let isBand = user.role === 'band'
    let isCurrentMonth, isPreviousMonth

    if (user.registeredAt) {
      let registerDate = new Date(user.registeredAt)
      isCurrentMonth =
        registerDate.getMonth() === currentDate.getMonth() &&
        registerDate.getFullYear() === currentDate.getFullYear()
      isPreviousMonth =
        registerDate.getMonth() === previousMonthDate.getMonth() &&
        registerDate.getFullYear() === previousMonthDate.getFullYear()
    }

    if (isCurrentMonth) {
      usersData.usersThisMonth += 1
    }

    if (isPreviousMonth) {
      usersData.userLastMonth += 1
    }

    if (isCompany && isCurrentMonth) {
      usersData.companiesThisMonth += 1
    }

    if (isCompany && isPreviousMonth) {
      usersData.companiesLastMonth += 1
    }

    if (isBand && isCurrentMonth) {
      usersData.bandsThisMonth += 1
    }

    if (isBand && isPreviousMonth) {
      usersData.bandsLastMonth += 1
    }
  })
  usersData = {
    ...usersData,
    difference: usersData.usersThisMonth - usersData.usersLastMonth,
    companiesDifferences:
      usersData.companiesThisMonth - usersData.companiesLastMonth,
    bandsDifferences: usersData.bandsThisMonth - usersData.bandsLastMonth,
  }
  return usersData
})

const subscriptionDifference = computed(() => {
  let currentMonthSubscriptions = 0
  let previousMonthSubscriptions = 0
  let difference = 0

  userStore.users.forEach((user) => {
    const activeSubscription = user.activeSubscription

    if (!activeSubscription || !activeSubscription.currentPeriodStart) {
      return
    }

    const currentPeriodStart = new Date(activeSubscription.currentPeriodStart)

    const currentDate = new Date()
    const previousMonthDate = new Date()
    previousMonthDate.setMonth(currentDate.getMonth() - 1)

    const isCurrentMonth =
      currentPeriodStart.getMonth() === currentDate.getMonth() &&
      currentPeriodStart.getFullYear() === currentDate.getFullYear()
    const isPreviousMonth =
      currentPeriodStart.getMonth() === previousMonthDate.getMonth() &&
      currentPeriodStart.getFullYear() === previousMonthDate.getFullYear()

    if (isCurrentMonth && user.role === 'company') {
      currentMonthSubscriptions++
    }

    if (isPreviousMonth && user.role === 'company') {
      previousMonthSubscriptions++
    }
  })

  difference = currentMonthSubscriptions - previousMonthSubscriptions
  return { difference, currentMonthSubscriptions }
})

const eventsActives = computed(() => {
  let eventsActives = 0
  let eventsClosedLastMonth = 0

  const events = eventStore.events.filter(
    (e) =>
      e.eventType === 'event' &&
      (e.status === 'published' || e.status === 'closed')
  )
  const currentDate = new Date()
  const previousMonthDate = new Date()
  previousMonthDate.setMonth(currentDate.getMonth() - 1)

  events.forEach((event) => {
    const endDate = new Date(
      event.eventEndDate?.year,
      event.eventEndDate?.month - 1,
      event.eventEndDate?.day
    )
    const isCurrentMonth =
      endDate.getMonth() === currentDate.getMonth() &&
      endDate.getFullYear() === currentDate.getFullYear()

    const isPreviousMonth =
      endDate.getMonth() === previousMonthDate.getMonth() &&
      endDate.getFullYear() === previousMonthDate.getFullYear()

    if (isCurrentMonth) {
      eventsActives++
    }

    if (isPreviousMonth) {
      eventsClosedLastMonth++
    }
  })

  const difference = eventsActives - eventsClosedLastMonth

  return { difference, eventsActives }
})

const isPositive = (value) => {
  if (value === '') return ''
  return value > 0 ? `+${value}` : `${value}`
}

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: t('statisticsSection.title'),
})

onMounted(() => {
  userStore.fetchUsers()
})
</script>
