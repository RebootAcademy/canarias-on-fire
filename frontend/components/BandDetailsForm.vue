<template>
  <div class="flex flex-col w-full items-center p-6">
    <div class="flex flex-col w-full items-start">
      <div class="flex items-center">
        <ArrowLeft size="24" @click="$emit('back')" class="text-yellow-500 cursor-pointer"/>
        <h1 class="text-2xl font-bold text-primary">{{ $t('onBoarding.step2Band')}}</h1>
      </div>
      <p class="text-gray-400 mb-8">
        {{  $t('onBoarding.step2BandDescription') }}
      </p>  
    </div>
    <div class="flex flex-col justify--center  mb-4 border-2 border-gray rounded-md  p-4 sm:w-full md:w-2/3 lg:w-1/2 ">
        <ImageUploader @image-uploaded="handleImageUpload" />  
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <Label class="text-gray-300">{{ $t('onBoarding.step2BandName')}}<span class="text-primary">*</span></Label>
            <Input id="bandName" v-model="formData.bandName" class="text-gray-500" required />
          </div>
          <div class="mb-4">
            <Label class="text-gray-300">{{ $t('onBoarding.step2Email')}}<span class="text-primary">*</span></Label>
            <Input id="email" v-model="formData.email" type="email" class="text-gray-500" required />
          </div>
          <div class="mb-4">
            <Label class="text-gray-300">{{ $t('onBoarding.step2Phone')}}<span class="text-primary">*</span></Label>
            <Input id="phone" v-model="formData.phone" class="text-gray-500" required />
          </div>
          <div class="mb-4">
            <Label class="text-gray-300">{{ $t('onBoarding.step2Genres.label')}} <span class="text-primary">*</span></Label>
            <Select v-model="formData.genre" required>
              <SelectTrigger>
                <SelectValue placeholder="Select genre" class="text-gray-500" />
              </SelectTrigger>
              <SelectContent class="text-gray-500">
                <SelectItem value="rock">{{ $t('onBoarding.step2Genres.rock')}}</SelectItem>
                <SelectItem value="pop">{{ $t('onBoarding.step2Genres.pop')}}</SelectItem>
                <SelectItem value="jazz">{{ $t('onBoarding.step2Genres.jazz')}}</SelectItem>
                <SelectItem value="electronic">{{ $t('onBoarding.step2Genres.electronic')}}</SelectItem>
                <SelectItem value="hiphop">{{ $t('onBoarding.step2Genres.hiphop')}}</SelectItem>
                <SelectItem value="other">{{ $t('onBoarding.step2Genres.other')}}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="mb-4">
            <Label class="text-gray-300">{{ $t('onBoarding.step2BandMembers')}} <span class="text-primary">*</span></Label>
            <Input id="members" v-model="formData.members" class="text-gray-500" placeholder="e.g. John (Guitar), Sarah (Vocals)" required />
          </div>
          <div class="mb-4">
            <Label class="text-gray-300">{{ $t('onBoarding.step2Bio')}}</Label>
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
             {{ $t('onBoarding.step2TermsPart1')}} <a href="#" class="text-yellow-500">{{ $t('onBoarding.step2TermsPart2')}}</a>
            </label>
          </div>      
        </form>
        <div>
        </div>
      </div>
      <div class="bg-primary-gradient rounded-full p-0.5">
        <button
          type="submit"
          @click="submitForm"
          class="w-full bg-black text-white px-4 py-2 rounded-full font-semibold  transition duration-300 hover:bg-primary-gradient hover:text-white"
        >
          {{ $t('buttons.completeReg')}}
        </button>
      </div>
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

onMounted(() => {
  const { userData } = userStore

  if (userData) {
    formData.value.email = userData.email || ''
  }
})

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
