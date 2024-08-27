<template>
  <div class="p-6">
    <div class="flex items-center">
      <NuxtLink to="/dashboard/onboarding" class="text-yellow-500 mr-4">
        <ArrowLeft size="24" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-primary">STEP 2 of 2: Enter Your Band Details</h1>
    </div>
    <p class="text-gray-400 mb-8">
      Please complete the form below with your band's details to finish setting up your account.
    </p>

    <div class="flex justify-center items-center space-x-6 mb-4">
      <div class="rounded-full border border-orange-500 w-24 h-24 flex items-center justify-center text-3xl font-bold text-white"></div>
    </div>
    <ImageUploader @image-uploaded="handleImageUpload" />

    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <Label class="text-gray-300">Band Name <span class="text-primary">*</span></Label>
        <Input id="bandName" v-model="formData.bandName" class="text-gray-500" required />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300">Contact Email <span class="text-primary">*</span></Label>
        <Input id="email" v-model="formData.email" type="email" class="text-gray-500" required />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300">Phone <span class="text-primary">*</span></Label>
        <Input id="phone" v-model="formData.phone" class="text-gray-500" required />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300">Genre <span class="text-primary">*</span></Label>
        <Select v-model="formData.genre" required>
          <SelectTrigger>
            <SelectValue placeholder="Select genre" class="text-gray-500" />
          </SelectTrigger>
          <SelectContent class="text-gray-500">
            <SelectItem value="rock">Rock</SelectItem>
            <SelectItem value="pop">Pop</SelectItem>
            <SelectItem value="jazz">Jazz</SelectItem>
            <SelectItem value="electronic">Electronic</SelectItem>
            <SelectItem value="hiphop">Hip Hop</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="mb-4">
        <Label class="text-gray-300">Band Members <span class="text-primary">*</span></Label>
        <Input id="members" v-model="formData.members" class="text-gray-500" placeholder="e.g. John (Guitar), Sarah (Vocals)" required />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300">Bio</Label>
        <Textarea id="bio" v-model="formData.bio" class="text-gray-500" rows="4" />
      </div>
      <div class="flex items-center mb-4">
        <input
          id="terms"
          v-model="formData.termsAccepted"
          type="checkbox"
          required
          class="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-400">
          I accept the <a href="#" class="text-yellow-500">terms and conditions</a>
        </label>
      </div>
      <div>
        <Button
          type="submit"
          variant="secondary"
          class="w-full text-black px-4 py-2 rounded-full font-semibold hover:bg-orange-400 transition duration-300"
        >
          COMPLETE REGISTRATION
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'

const formData = ref({
  bandName: '',
  email: '',
  phone: '',
  genre: '',
  members: '',
  bio: '',
  termsAccepted: false,
  imageUrl: ''
})

const router = useRouter()
const userStore = useUserStore()

const handleImageUpload = (imageUrl) => {
  formData.value.imageUrl = imageUrl
}

const submitForm = async () => {
  if (formData.value.termsAccepted) {
    try {
      const userId = userStore.userData._id
      console.log('User ID being sent:', userId)
      if (!userId) {
        console.error('User ID is undefined or null')
        // Manejar el caso de ID faltante (tal vez redirigir al login)
        return
      }
      const result = await userStore.updateUserProfileToBand({
        ...formData.value,
        _id: userId,
        role: 'musician'
      })
      if (result.success) {
        router.push('/dashboard')
      } else {
        console.error('Error updating user:', result.message)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  } else {
    alert('Please accept the terms and conditions')
  }
}
</script>
