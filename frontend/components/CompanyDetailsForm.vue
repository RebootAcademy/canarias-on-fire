<template>
  <div class="p-6">
    <div class="flex items-center">
      <NuxtLink to="/dashboard/onboarding" class="text-yellow-500 mr-4">
        <ArrowLeft size="24" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-primary">STEP 2 of 2: Enter Your Company Details</h1>
    </div>
    <p class="text-gray-400 mb-8">
      Please complete the form below with your company's details to finish setting up your account.
    </p>

    <div class="flex justify-center items-center space-x-6 mb-4">
      <div class="rounded-full border border-orange-500 w-24 h-24 flex items-center justify-center text-3xl font-bold text-white"></div>
    </div>
    <ImageUploader />

    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <Label class="text-gray-300"
          >Company Name <span class="text-primary">*</span></Label
        >
        <Input
          id="companyName"
          v-model="formData.companyName"
          class="text-gray-500"
        />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300"
          >Company Email <span class="text-primary">*</span></Label
        >
        <Input
          id="companyEmail"
          v-model="formData.companyEmail"
          class="text-gray-500"
        />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300"
          >Phone <span class="text-primary">*</span></Label
        >
        <Input id="phone" v-model="formData.phone" class="text-gray-500" />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300"
          >Address <span class="text-primary">*</span></Label
        >
        <Input id="phone" v-model="formData.address" class="text-gray-500" />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300"
          >Sector <span class="text-primary">*</span></Label
        >
        <Select v-model="formData.sector">
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
  companyName: '',
  email: '',
  phone: '',
  postalCode: '',
  address: '',
  sector: '',
  termsAccepted: false,
  imageUrl: ''
})

const router = useRouter()
const userStore = useUserStore()

const submitForm = async () => {
  if (formData.value.termsAccepted) {
    try {
      const userId = userStore.userData._id
      console.log('User ID being sent:', userId) // Añade este log
      if (!userId) {
        console.error('User ID is undefined or null')
        // Manejar el caso de ID faltante (tal vez redirigir al login)
        return
      }
      const result = await userStore.updateUserProfileToCompany({
        ...formData.value,
        _id: userId,
        role: 'company'
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