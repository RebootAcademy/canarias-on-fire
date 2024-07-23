<template>
  <div v-if="user">
    <div class="flex items-center mb-6">
      <Button @click="$emit('back')" class="text-sm px-3" variant="transparent">
        <ArrowLeft />
      </Button>
      <h2 class="text-2xl font-semibold">{{ user.username }}</h2>
    </div>
    <hr />
    <div class="p-6">
      <div class="flex items-center space-x-6 mb-4">
        <div
          class="bg-gray-300 rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold text-white"
        >
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h3 class="text-xl font-semibold">{{ user.username }}</h3>
          <p class="text-gray-600">{{ user.email }}</p>
        </div>
      </div>
      <div class="mb-4">
        <Label for="username">Username</Label>
        <Input
          id="username"
          v-model="editedUser.username"
          class="mt-1 text-gray-500"
        />
      </div>
      <div class="mb-4">
        <Label for="email">Email</Label>
        <Input
          id="email"
          v-model="editedUser.email"
          class="mt-1 text-gray-500"
        />
      </div>
      <div class="mb-4">
        <Label class="mb-2">Role</Label>
        <Select v-model="selectedRole">
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent class="text-gray-500">
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Company-specific fields -->
      <div v-if="selectedRole === 'company'">
        <div class="mb-4">
          <Label for="companyName">Company Name</Label>
          <Input
            id="companyName"
            v-model="editedUser.companyName"
            class="mt-1 text-gray-500"
          />
        </div>
        <div class="mb-4">
          <Label for="companyEmail">Company Email</Label>
          <Input
            id="companyEmail"
            v-model="editedUser.companyEmail"
            class="mt-1 text-gray-500"
          />
        </div>
        <div class="mb-4">
          <Label for="phone">Phone</Label>
          <Input
            id="phone"
            v-model="editedUser.phone"
            class="mt-1 text-gray-500"
          />
        </div>
        <div class="mb-4">
          <Label for="sector">Sector</Label>
          <Select v-model="editedUser.sector">
            <SelectTrigger>
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent class="text-gray-500">
              <SelectItem value="restoration">Restoration</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="nightlife">Nightlife</SelectItem>
              <SelectItem value="activities">Activities</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
    <!-- Actions -->
    <div class="flex gap-4 mt-12">
      <Button @click="deleteUser" class="px-6" variant="outline">
        Delete
      </Button>
      <Button @click="deactivateUser" variant="secondary"> Deactivate </Button>
      <Button @click="updateUser" class="px-6"> Update </Button>
    </div>
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

const emit = defineEmits(['update', 'deactivate', 'delete', 'back'])

const userStore = useUserStore()
const editedUser = ref({ ...props.user })
const selectedRole = ref(props.user.role)

watch(selectedRole, (newRole) => {
  editedUser.value.role = newRole
})

const updateUser = async () => {
  try {
    const result = await userStore.updateUserProfile(editedUser.value)
    if (result.success) {
      if (result.user._id !== editedUser.value._id) {
        editedUser.value = { ...result.user }
      }
      emit('update', result.user)
    } else {
      console.error('Failed to update user:', result.message)
    }
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const deactivateUser = () => {
  emit('deactivate', props.user._id)
}

const deleteUser = async () => {
  try {
    const result = await userStore.deleteUser(props.user._id)
    if (result.success) {
      emit('delete', props.user._id)
    } else {
      console.error('Failed to delete user:', result.message)
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
</script>
