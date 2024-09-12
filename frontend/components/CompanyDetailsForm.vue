<template>
  <div class="flex flex-col w-full items-center p-6">
    <div class="flex flex-col w-full items-start">
      <div class="flex items-center justify-start">
        <ArrowLeft
          size="24"
          @click="$emit('back')"
          class="text-yellow-500 cursor-pointer mr-2"
        />
        <h1 class="text-2xl font-bold text-primary">
          {{ $t('onBoarding.step2Company') }}
        </h1>
      </div>
      <p class="text-gray-400 mb-8">
        {{ $t('onBoarding.step2CompanyDescription') }}
      </p>
    </div>

    <div
      class="flex flex-col justify--center mb-4 border-2 border-gray rounded-md p-4 sm:w-full md:w-2/3 lg:1/2 xl:w-2/5"
    >
      <ImageUploader />
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <Label class="text-gray-300">
            {{ $t('onBoarding.step2CompanyName') }}
            <span class="text-primary">*</span>
          </Label>
          <Input
            id="companyName"
            v-model="formData.companyName"
            class="text-gray-500"
          />
          <p v-if="errors.companyName" class="text-red-500 text-sm mt-1 italic">{{ errors.companyName }}</p>
        </div>
        <div class="mb-4">
          <Label class="text-gray-300"
            >{{ $t('onBoarding.step2Email') }}
            <span class="text-primary">*</span></Label
          >
          <Input
            id="companyEmail"
            v-model="formData.companyEmail"
            class="text-gray-500"
            disabled
          />
        </div>
        <div class="flex flex-row justify-between gap-2">
          <div class="mb-4">
            <Label class="text-gray-300">
              {{ $t('onBoarding.step2Phone') }}
              <span class="text-primary">*</span>
            </Label>
            <Input id="phone" v-model="formData.phone" class="text-gray-500" />
            <p v-if="errors.phone" class="text-red-500 text-sm mt-1 italic">{{ errors.phone }}</p>

          </div>
          <div class="mb-4">
            <Label class="text-gray-300">
              {{ $t('onBoarding.step2CIF') }}
              <span class="text-primary">*</span>
            </Label>
            <Input id="cif" v-model="formData.cif" class="text-gray-500" />
            <p v-if="errors.cif" class="text-red-500 text-sm mt-1 italic">{{ errors.cif }}</p>

          </div>
          <div class="mb-4">
            <Label class="text-gray-300">
              {{ $t('onBoarding.step2ZIP') }}
              <span class="text-primary">*</span>
            </Label>
            <Input
              id="postalCode"
              v-model="formData.postalCode"
              class="text-gray-500"
            />
          </div>
        </div>
        <div class="mb-4">
          <Label class="text-gray-300">
            {{ $t('onBoarding.step2Address') }}
            <span class="text-primary">*</span>
          </Label>
          <Input
            id="address"
            v-model="formData.address"
            class="text-gray-500"
          />
          <p v-if="errors.address" class="text-red-500 text-sm mt-1 italic">{{ errors.address }}</p>

        </div>
        <div class="mb-4">
          <Label class="text-gray-300">
            {{ $t('onBoarding.step2Sector.label') }}
            <span class="text-primary">*</span>
          </Label>
          <Select v-model="formData.sector">
            <SelectTrigger>
              <SelectValue
                :placeholder="$t('onBoarding.step2Sector.placeholder')"
                class="text-gray-500"
              />
            </SelectTrigger>
            <SelectContent class="text-gray-500">
              <SelectItem value="restoration">{{
                $t('onBoarding.step2Sector.restoration')
              }}</SelectItem>
              <SelectItem value="services">{{
                $t('onBoarding.step2Sector.services')
              }}</SelectItem>
              <SelectItem value="nightlife">{{
                $t('onBoarding.step2Sector.nigthlife')
              }}</SelectItem>
              <SelectItem value="activities">{{
                $t('onBoarding.step2Sector.activities')
              }}</SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.sector" class="text-red-500 text-sm mt-1 italic">{{ errors.sector }}</p>

        </div>
        <div class="mb-4">
          <Label class="text-gray-300">
            {{ $t('onBoarding.step2CodRef') }}
            <span class="text-primary">*</span>
          </Label>
          <Input id="phone" v-model="formData.refCode" class="text-gray-500" />
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
            {{ $t('onBoarding.step2TermsPart1') }}
            <a href="#" class="text-yellow-500">{{
              $t('onBoarding.step2TermsPart2')
            }}</a>
          </label>
        </div>
        <div v-if="errors.termsAccepted">
          <span class="text-red-500 text-sm">{{ errors.termsAccepted }}</span>
        </div>
      </form>
    </div>
    <div>
      <div class="bg-primary-gradient rounded-full p-0.5">
        <button
          type="submit"
          @click="submitForm"
          class="w-full bg-black text-white px-4 py-2 rounded-full font-semibold transition duration-300 hover:bg-primary-gradient hover:text-white"
        >
          {{ $t('buttons.completeReg') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@vueuse/core'
import { ArrowLeft } from 'lucide-vue-next'
const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

const formData = ref({
  companyName: '',
  phone: '',
  cif: '',
  postalCode: '',
  address: '',
  sector: '',
  termsAccepted: false,
  imageUrl: '',
  refCode: '',
})

onMounted(() => {
  const { userData } = userStore

  if (userData) {
    formData.value.companyEmail = userData.email || ''
  }
})

const errors = ref({
  companyName: '',
  phone: '',
  cif: '',
  address: '',
  sector: '',
  termsAccepted: '',
})
const submitForm = async () => {
  if (formData.value.termsAccepted) {
    errors.value = {
      companyName: '',
      phone: '',
      cif: '',
      address: '',
      sector: '',
      termsAccepted: '',
    }
    if (!validateForm()) return false
    if (!validateCIF(formData.value.cif)) return errors.value.cif = t('onBoarding.step2InvalidCIF')
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
        role: 'company',
      })
      if (result.success) {
        router.push('/dashboard/events')
      } else {
        console.error('Error updating user:', result.message)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  } else {
    errors.value.termsAccepted = t('onBoarding.step2TermsRequired')
  }
}

function validateForm() {
  Object.keys(errors.value).forEach((key) => {
    if (!formData.value[key] || formData.value[key] === '') {
      errors.value[key] = t('onBoarding.requiredField')
    } else {
      errors.value[key] = ''
    }
  });
  return Object.values(errors.value).every(error => error === '')
}
</script>
