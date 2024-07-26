<template>
  <div class="p-6">
    <div class="flex items-center space-x-6 mb-4">
      <div
        class="bg-gray-300 rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold text-white"
      >
        {{ (editedUser.role === 'company' ? editedUser.companyName : editedUser.username).charAt(0).toUpperCase() }}
      </div>
      <div>
        <h3 class="text-xl font-semibold">
          {{ editedUser.role === 'company' ? editedUser.companyName : editedUser.username }}
        </h3>
        <p class="text-gray-600">{{ editedUser.email }}</p>
        <p v-if="!editedUser.isActive" class="text-red-500 font-semibold">Deactivated</p>
      </div>
    </div>

    <form @submit.prevent="updateUser">
      <div class="mb-4">
        <Label for="username">Username</Label>
        <Input
          id="username"
          v-model="editedUser.username"
          :disabled="!editedUser.isActive"
        />
      </div>
      <div class="mb-4">
        <Label for="email">Email</Label>
        <Input
          id="email"
          v-model="editedUser.email"
          :disabled="!editedUser.isActive"
        />
      </div>
      <div class="mb-4">
        <Label class="mb-2">Role</Label>
        <Select 
          v-model="selectedRole"
          :disabled="!editedUser.isActive"
        >
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
  
      <hr class="mb-6">
      <!-- Company-specific fields -->
      <div v-if="selectedRole === 'company'">
        <div class="mb-4">
          <Label for="companyName">Company Name</Label>
          <Input
            id="companyName"
            v-model="editedUser.companyName"
            :disabled="!editedUser.isActive"
          />
        </div>
        <div class="mb-4">
          <Label for="companyEmail">Company Email</Label>
          <Input
            id="companyEmail"
            v-model="editedUser.companyEmail"
            :disabled="!editedUser.isActive"
          />
        </div>
        <div class="mb-4">
          <Label for="phone">Phone</Label>
          <Input
            id="phone"
            v-model="editedUser.phone"
            :disabled="!editedUser.isActive"
          />
        </div>
        <div class="mb-4">
          <Label for="sector">Sector</Label>
          <Select 
            v-model="editedUser.sector"
            :disabled="!editedUser.isActive"
          >
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
      <div class="flex gap-4 mt-12">
        <Button @click="deleteUser" class="px-6" variant="destructive"> Delete </Button>
        <Button @click="toggleUserActivation" variant="outline">
          {{ editedUser.isActive ? 'Deactivate' : 'Activate' }}
        </Button>
        <Button 
          @click="updateUser" 
          :disabled="!editedUser.isActive"
          class="px-6"
        >
          Update 
        </Button>
      </div>
    </form>
    
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const userStore = useUserStore()
const selectedRole = ref(props.user.role)
const editedUser = reactive({ ...props.user })

watch(() => props.user, (newUser) => {
  Object.assign(editedUser, newUser)
  selectedRole.value = newUser.role
}, { deep: true })

const updateUser = async () => {
  if (editedUser && editedUser._id) {
    const result = await userStore.updateUserProfile(toRaw(editedUser))
    if (result.success) {
      Object.assign(editedUser, result.user)
    }
  } else {
    console.error('Invalid user data for update')
  }
}

const toggleUserActivation = async () => {
  editedUser.isActive = !editedUser.isActive
  const result = await userStore.updateUserProfile(toRaw(editedUser))
  if (result.success) {
    Object.assign(editedUser, result.user)
  }
}

const deleteUser = async () => {
  const result = await userStore.deleteUser(editedUser._id)
  if (result.success) {
    console.log('User deleted successfully')
    // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
  }
}
</script>