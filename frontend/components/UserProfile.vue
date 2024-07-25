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

      <Tabs v-if="user.role === 'company'" v-model="activeTab" class="w-auto">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
      </Tabs>

    </div>
    <hr />
    <UserProfileDetails v-if="activeTab === 'profile'" :user="user" />
    <UserEvents v-else-if="activeTab === 'events'" :userId="user._id" />
    <UserSubscriptions v-else-if="activeTab === 'subscriptions'" :userId="user._id" />
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

const emit = defineEmits('back')

const userStore = useUserStore()
const editedUser = ref({ ...props.user })
const selectedRole = ref(props.user.role)
const activeTab = ref('profile')

watch(selectedRole, (newRole) => {
  editedUser.value.role = newRole
})
</script>
