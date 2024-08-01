<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Profile</h2>
    <hr class="mb-4">
    <div v-if="userStore.isAuthenticated">
      <div class="flex items-center mb-4">
        <Avatar>
          <AvatarImage :src="userStore.userData?.profileImg" alt="User Avatar" />
          <AvatarFallback>{{ formData.username?.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div class="ml-4">
          <h3 class="text-lg font-semibold">{{ formData.username }}</h3>
        </div>
      </div>
      <form @submit.prevent="updateProfile">
        <div class="mb-4">
          <Label class="block text-sm font-medium text-gray-700">Profile Image</Label>
          <Input type="file" @change="handleFileChange" accept="image/*" />
          <Button type="button" @click="uploadImage" class="mt-2">Upload Image</Button>
        </div>
        <div class="mb-4">
          <Label class="block text-sm font-medium text-gray-700">Username</Label>
          <Input class="mt-1 block w-full" v-model="formData.username" />
        </div>
        <div class="mb-4">
          <Label class="block text-sm font-medium text-gray-700">Email</Label>
          <Input class="mt-1 block w-full" v-model="formData.email" />
        </div>
        <Button type="submit" :disabled="isUpdating">
        {{ isUpdating ? 'Updating...' : 'Update profile' }}
        </Button>
      </form>
    </div>
    <div v-else>
      <p>Please log in to view your profile.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'User Profile'
})

const { user, isAuthenticated } = useAuth0()
const userStore = useUserStore()

const formData = reactive({
  _id: userStore.userData?._id,
  username: userStore.userData?.username || '',
  email: userStore.userData?.email || '',
  profileImg: userStore.userData?.profileImg || ''
})

const isUpdating = ref(false)
const selectedFile = ref(null)

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadImage = async () => {
  if (!selectedFile.value) {
    console.error('No file selected')
    return
  }

  const cloudName = 'drs1a2bso' // Reemplaza con tu cloud name de Cloudinary
  const uploadPreset = 'evdhvl07' // Reemplaza con tu upload preset de Cloudinary

  const formDataForUpload = new FormData()
  formDataForUpload.append('file', selectedFile.value)
  formDataForUpload.append('upload_preset', uploadPreset)

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formDataForUpload
    })

    const data = await response.json()
    if (data.secure_url) {
      formData.profileImg = data.secure_url
    }
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

async function updateProfile() {
  isUpdating.value = true
  try {
    const dataToUpdate = { ...formData, _id: userStore.userData?._id }
    const result = await userStore.updateUserProfile(dataToUpdate)
    if (result.success) {
      console.log('Profile updated successfully')
    } else {
      console.error('Failed to update profile:', result.message)
    }
  } finally {
    isUpdating.value = false
  }
}
</script>