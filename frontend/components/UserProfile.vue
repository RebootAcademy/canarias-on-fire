<template>
  <div v-if="user">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <Button @click="$emit('back')" class="text-sm px-3" variant="transparent">
          <ArrowLeft />
        </Button>
        <h2 class="text-2xl font-semibold">        
          {{ user.role === 'company' ? user.companyName : user.username }}
        </h2>
      </div>

      <Tabs v-if="user.role === 'company'" v-model="activeTab" class="w-auto" @update:modelValue="onTabChange">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
      </Tabs>

    </div>
    <hr />
    <UserProfileDetails 
      v-if="activeTab === 'profile'" 
      :user="user"
    />
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['back', 'tabChange'])

const editedUser = ref({ ...props.user })
const selectedRole = ref(props.user.role)
const activeTab = ref('profile')

const onTabChange = (newTab) => {
  emit('tabChange', newTab)
}

watch(selectedRole, (newRole) => {
  editedUser.value.role = newRole
})

watch(activeTab, (newTab) => {
  emit('tabChange', newTab)
})
</script>