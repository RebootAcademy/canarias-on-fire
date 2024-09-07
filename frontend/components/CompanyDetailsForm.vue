<template>
  <div class="flex flex-col w-full items-center p-6">
    <div class="flex flex-col w-full items-start">
      <div class="flex items-center justify-start ">
        <ArrowLeft size="24" @click="$emit('back')" class="text-yellow-500 cursor-pointer mr-2"/>
        <h1 class="text-2xl font-bold text-primary">{{ $t('onBoarding.step2Company')}}</h1>
      </div>
      <p class="text-gray-400 mb-8">
        {{ $t('onBoarding.step2CompanyDescription') }}
      </p>

    </div>

    <div class="flex flex-col justify--center mb-4 border-2 border-gray rounded-md  p-4 sm:w-full md:w-2/3 lg:w-1/2">

    <ImageUploader />
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <Label class="text-gray-300">
          {{ $t('onBoarding.step2CompanyName')}}
          <span class="text-primary">*</span>
        </Label
        >
        <Input
          id="companyName"
          v-model="formData.companyName"
          class="text-gray-500"
        />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300"
          >{{ $t('onBoarding.step2Email')}} <span class="text-primary">*</span></Label
        >
        <Input
          id="companyEmail"
          v-model="formData.companyEmail"
          class="text-gray-500"
        />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300">
          {{ $t('onBoarding.step2Phone')}} 
          <span class="text-primary">*</span>
          </Label>
        <Input id="phone" v-model="formData.phone" class="text-gray-500" />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300">
          {{ $t('onBoarding.step2Address')}} 
          <span class="text-primary">*</span>
        </Label>
        <Input id="address" v-model="formData.address" class="text-gray-500" />
      </div>
      <div class="mb-4">
        <Label class="text-gray-300">
          {{ $t('onBoarding.step2Sector.label')}}
          <span class="text-primary">*</span>
        </Label>
        <Select v-model="formData.sector">
          <SelectTrigger>
            <SelectValue :placeholder="$t('onBoarding.step2Sector.placeholder')" class="text-gray-500" />
          </SelectTrigger>
          <SelectContent class="text-gray-500">
            <SelectItem value="restoration">{{ $t('onBoarding.step2Sector.restoration')}}</SelectItem>
            <SelectItem value="services">{{ $t('onBoarding.step2Sector.services')}}</SelectItem>
            <SelectItem value="nightlife">{{ $t('onBoarding.step2Sector.nigthlife')}}</SelectItem>
            <SelectItem value="activities">{{ $t('onBoarding.step2Sector.activities')}}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="mb-4">
        <Label class="text-gray-300">
          {{ $t('onBoarding.step2CodRef')}}
          <span class="text-primary">*</span>
        </Label>
        <Input id="phone" v-model="formData.refCode" class="text-gray-500" />
      </div>
      <div class="flex items-center mb-4 ">
        <input
          id="terms"
          v-model="formData.termsAccepted"
          type="checkbox"
          required
          class="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-400">
          {{ $t('onBoarding.step2TermsPart1') }} <a href="#" class="text-yellow-500">{{ $t('onBoarding.step2TermsPart2') }}</a>
        </label>
      </div>
      
    </form>
    </div>
    <div v-if="errors.termsAccepted">
      <span>{{ errors.termsAccepted }}</span>
    </div>
    <div>
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
  </div>
</template>

<script setup>
import { formatDate } from '@vueuse/core'
import { ArrowLeft } from 'lucide-vue-next'

const formData = ref({
  companyName: '',
  email: '',
  phone: '',
  postalCode: '',
  address: '',
  sector: '',
  termsAccepted: false,
  imageUrl: '',
  refCode: '',
})
const userStore = useUserStore()

onMounted(() => {
  const { userData } = userStore

  if (userData) {
    formData.value.companyEmail = userData.email || ''
  }
})


const router = useRouter()

const submitForm = async () => {

  console.log(formatDate.value)
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