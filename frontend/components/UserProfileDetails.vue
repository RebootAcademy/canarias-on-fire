<template>
  <div class="p-6">
    <div class="flex items-center space-x-6 mb-4">
      <div
        class="bg-gray-300 rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold text-white"
      >
        {{
          (editedUser.role === 'company'
            ? editedUser.companyName
            : editedUser.username
          )
            .charAt(0)
            .toUpperCase()
        }}
      </div>
      <div>
        <h3 class="text-xl font-semibold">
          {{
            editedUser.role === 'company'
              ? editedUser.companyName
              : editedUser.username
          }}
        </h3>
        <p class="text-gray-600">{{ editedUser.email }}</p>
        <p v-if="!editedUser.isActive" class="text-red-500 font-semibold">
          Deactivated
        </p>
      </div>
    </div>

    <form @submit.prevent="updateUser">
      <div class="mb-4">
        <Label for="username" class="text-gray-300">Username</Label>
        <Input
          id="username"
          v-model="editedUser.username"
          :disabled="!editedUser.isActive"
          class="text-gray-500"
        />
      </div>
      <div class="mb-4">
        <Label for="email" class="text-gray-300">Email</Label>
        <Input
          id="email"
          v-model="editedUser.email"
          :disabled="!editedUser.isActive"
          class="text-gray-500"
        />
      </div>
      <div class="mb-4">
        <Label class="mb-2 text-gray-300">Role</Label>
        <Select v-model="editedUser.role" :disabled="!editedUser.isActive">
          <SelectTrigger>
            <SelectValue placeholder="Select role" class="text-gray-500" />
          </SelectTrigger>
          <SelectContent class="text-gray-500">
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <hr class="mb-6" />
      <!-- Company-specific fields -->
      <div v-if="editedUser.role === 'company'">
        <div class="mb-4">
          <Label for="companyName" class="text-gray-300">Company Name</Label>
          <Input
            id="companyName"
            v-model="editedUser.companyName"
            :disabled="!editedUser.isActive"
            class="text-gray-500"
          />
        </div>
        <div class="mb-4">
          <Label for="companyEmail" class="text-gray-300">Company Email</Label>
          <Input
            id="companyEmail"
            v-model="editedUser.companyEmail"
            :disabled="!editedUser.isActive"
            class="text-gray-500"
          />
        </div>
        <div class="mb-4">
          <Label for="phone" class="text-gray-300">Phone</Label>
          <Input
            id="phone"
            v-model="editedUser.phone"
            :disabled="!editedUser.isActive"
            class="text-gray-500"
          />
        </div>
        <div class="mb-4">
          <Label for="sector" class="text-gray-300">Sector</Label>
          <Select v-model="editedUser.sector" :disabled="!editedUser.isActive">
            <SelectTrigger>
              <SelectValue placeholder="Select sector" class="text-gray-500" />
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
        <Button @click="deleteUser" class="px-6" variant="destructive">
          Delete
        </Button>
        <Button
          @click="toggleUserActivation"
          variant="outline"
          class="text-gray-500"
        >
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

const router = useRouter()
const userStore = useUserStore()
const editedUser = reactive({ ...props.user })

/* watch(() => props.user, (newUser) => {
  Object.assign(editedUser, newUser)
}, { deep: true }) */

watch(
  () => editedUser.role,
  (newRole, oldRole) => {
    if (newRole === 'company' && oldRole !== 'company') {
      // Inicializar campos de compañía si cambia a rol de compañía
      editedUser.companyName = editedUser.companyName || ''
      editedUser.companyEmail = editedUser.companyEmail || editedUser.email
      editedUser.phone = editedUser.phone || ''
      editedUser.sector = editedUser.sector || ''
    }
  }
)

const updateUser = async () => {
  if (editedUser && editedUser._id) {
    const dataToUpdate = {
      ...editedUser,
      role: editedUser.role,
      // Incluir campos de compañía solo si el rol es 'company'
      ...(editedUser.role === 'company' && {
        companyName: editedUser.companyName,
        companyEmail: editedUser.companyEmail,
        phone: editedUser.phone,
        sector: editedUser.sector,
      }),
    }
    const result = await userStore.updateUserProfile(toRaw(dataToUpdate))
    if (result.success) {
      Object.assign(editedUser, result.user)
      router.push('/dashboard')
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
