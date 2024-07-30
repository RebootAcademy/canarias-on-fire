<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 w-11/12 max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Add New User</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4 py-4">
          <div class="gap-4">
            <Label for="username">Username</Label>
            <Input id="username" v-model="formData.username" required />
          </div>
          <div class="gap-4">
            <Label for="email">Email</Label>
            <Input id="email" v-model="formData.email" type="email" required />
          </div>
          <div class="gap-4">
            <Label for="role">Role</Label>
            <Select v-model="formData.role">
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
          <template v-if="formData.role === 'company'">
            <div class="gap-4">
              <Label for="companyName">Company Name</Label>
              <Input id="companyName" v-model="formData.companyName" required />
            </div>
            <div class="gap-4">
              <Label for="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                v-model="formData.companyEmail"
                type="email"
                required
              />
            </div>
            <div class="gap-4">
              <Label for="phone">Phone</Label>
              <Input id="phone" v-model="formData.phone" />
            </div>
            <div class="gap-4">
              <Label for="sector">Sector</Label>
              <Select v-model="formData.sector" required>
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
          </template>
        </div>
        <div class="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" @click="closeModal"
            >Cancel</Button
          >
          <Button type="submit">Add User</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close', 'userAdded'])

const formData = reactive({
  username: '',
  email: '',
  role: 'basic',
  companyName: '',
  companyEmail: '',
  phone: '',
  sector: ''
})

const isFormValid = computed(() => {
  if (!formData.username || !formData.email || !formData.role) return false
  if (formData.role === 'company') {
    return formData.companyName && formData.companyEmail && formData.sector
  }
  return true
})

const closeModal = () => {
  emit('close')
  Object.keys(formData).forEach((key) => (formData[key] = ''))
  formData.role = 'basic'
}

const handleSubmit = () => {
  if (isFormValid.value) {
    const userData = { ...formData }
    if (userData.role === 'company') {
      // Si no se proporciona companyEmail, usar el email principal
      userData.companyEmail = userData.companyEmail || userData.email
    } else {
      delete userData.companyName
      delete userData.companyEmail
      delete userData.phone
      delete userData.sector
    }
    emit('userAdded', userData)
    closeModal()
  }
}
</script>
