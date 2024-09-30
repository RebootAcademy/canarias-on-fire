<template>
    <div class="flex justify-center items-center bg-background p-8 w-full">
        <div v-for="(user, idx) in users" :key="idx">
            <p>{{ user.companyName }}</p>
        </div>
    </div>
</template>

<script setup>
    const {t} = useI18n()
    const userStore = useUserStore()
    const eventStore = useEventStore()

    const {
  selectCategoryForFilterCompany,
} = storeToRefs(eventStore)

    const users = computed(() => {
        let filterUser

        console.log(selectCategoryForFilterCompany.value)

        if (selectCategoryForFilterCompany.value) {
         filterUser =   userStore.users.filter(user => user.role === 'company' && user?.sector === selectCategoryForFilterCompany.value.name)
        } else {
            filterUser =   userStore.users.filter(user => user.role === 'company')
        }

        console.log(filterUser)
        return filterUser
    })
</script>