<template>
  <div class="flex flex-col w-full items-center md:p-6">
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
      class="flex flex-col justify-center mb-4 border-2 border-gray rounded-md p-2 md:p-4 w-full md:w-2/3 lg:1/2 xl:w-2/5"
    >
      <ImageUploader @image-uploaded="handleImageUploaded"/>
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
          <p v-if="errors.companyName" class="text-red-500 text-sm mt-1 italic">
            {{ errors.companyName }}
          </p>
        </div>

        <div class="mb-4">
          <Label class="text-gray-300">
            {{ $t('onBoarding.step2CommercialName') }}
            <span class="text-primary">*</span>
          </Label>
          <Input
            id="commercialName"
            v-model="formData.commercialName"
            class="text-gray-500"
          />
          <p v-if="errors.commercialName" class="text-red-500 text-sm mt-1 italic">
            {{ errors.commercialName }}
          </p>
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
            <p v-if="errors.phone" class="text-red-500 text-sm mt-1 italic">
              {{ errors.phone }}
            </p>
          </div>
          <div class="mb-4">
            <Label class="text-gray-300">
              {{ $t('onBoarding.step2CIF') }}
              <span class="text-primary">*</span>
            </Label>
            <Input id="cif" v-model="formData.cif" class="text-gray-500" />
            <p v-if="errors.cif" class="text-red-500 text-sm mt-1 italic">
              {{ errors.cif }}
            </p>
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
            v-model="formData.preferredLocations"
            class="text-gray-500"
          />
          <p v-if="errors.preferredLocations" class="text-red-500 text-sm mt-1 italic">
            {{ errors.preferredLocations }}
          </p>
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
              <SelectItem value="promoter">
                {{$t('onBoarding.step2Sector.promoter')}}
              </SelectItem>
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
              <SelectItem value="hotels">{{
                $t('onBoarding.step2Sector.hotels')
              }}</SelectItem>
              <SelectItem value="others">{{
                $t('onBoarding.step2Sector.others')
              }}</SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.sector" class="text-red-500 text-sm mt-1 italic">
            {{ errors.sector }}
          </p>
          <div
            v-if="formData.sector === 'restoration'"
            class="flex flex-col gap-1 mt-4"
          >
            <Label class="text-gray-300">
              {{ $t('onBoarding.foodType.label') }}
              <span class="text-primary">*</span>
            </Label>
            <CustomSelect
              :placeholder="placeholderSelect"
              v-model:selected="formData.type"
              :items="restorationSectors"
              :optionDefault="foodSelected"
            />
          </div>
          <div
            v-if="formData.sector === 'services'"
            class="flex flex-col gap-1 mt-4"
          >
            <Label class="text-gray-300">
              {{ $t('onBoarding.serviceType.label') }}
              <span class="text-primary">*</span>
            </Label>
            <CustomSelect
              :placeholder="placeholderSelect"
              v-model:selected="formData.serviceType"
              :items="serviceSectors"
              :optionDefault="serviceSelected"
            />
          </div>
        </div>
        <div class="mb-4">
          <Label class="text-gray-300">
            {{ $t('onBoarding.step2CodRef') }}
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
          <a
            href="https://evente.es/terms-conditions"
            target="_blank"
            rel="noopener noreferrer"
            class="text-yellow-500"
          >
            {{ $t('onBoarding.step2TermsPart2') }}
          </a>
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
          class="w-full bg-background text-secondary px-4 py-2 rounded-full font-semibold transition duration-300 hover:bg-primary-gradient hover:text-white"
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
import { useToast } from '@/components/ui/toast/use-toast'
const userStore = useUserStore()
const router = useRouter()
const { toast } = useToast()
const { t } = useI18n()

const isCompanyNameSynced = ref(true)

const foodSelected = ref('')
const serviceSelected = ref('')

const formData = ref({
  companyName: '',
  commercialName: '',
  phone: '',
  cif: '',
  postalCode: '',
  preferredLocations: '',
  sector: '',
  type: foodSelected.value,
  serviceType: '',
  termsAccepted: false,
  profileImg: '',
  refCode: '',
})

const handleImageUploaded = (url) => {
  formData.value.profileImg = url;
};

onMounted(() => {
  const { userData } = userStore

  if (userData) {
    formData.value.companyEmail = userData.email || ''
  }
})

const placeholderSelect = computed(() => {
  return t('onBoarding.step2Sector.placeholder')
})

const restorationSectors = computed(() => {
  return [
    { value: 'family', label: t('onBoarding.foodType.family') },
    { value: 'spanish', label: t('onBoarding.foodType.spanish') },
    { value: 'italian', label: t('onBoarding.foodType.italian') },
    { value: 'mexican', label: t('onBoarding.foodType.mexican') },
    { value: 'asian', label: t('onBoarding.foodType.asian') },
    { value: 'vegan', label: t('onBoarding.foodType.vegan') },
    { value: 'vegetarian', label: t('onBoarding.foodType.vegetarian') },
    { value: 'fastfood', label: t('onBoarding.foodType.fastfood') },
    { value: 'tapas', label: t('onBoarding.foodType.tapas') },
    { value: 'other', label: t('onBoarding.foodType.other') },
  ]
})

const serviceSectors = computed(() => {
  return [
    { value: 'foodtruck', label: t('onBoarding.serviceType.foodtruck') },
    { value: 'catering', label: t('onBoarding.serviceType.catering') },
    { value: 'sound', label: t('onBoarding.serviceType.sound') },
    { value: 'photo', label: t('onBoarding.serviceType.photo') },
    { value: 'furniture', label: t('onBoarding.serviceType.furniture') },
    { value: 'renting', label: t('onBoarding.serviceType.renting') },
    { value: 'other', label: t('onBoarding.serviceType.other') }
  ]
})

/* watch(
  () => formData.value.companyName,
  (newVal) => {
    if (isCompanyNameSynced.value) {
      formData.value.commercialName = newVal
    }
  }
)

watch(
  () => formData.value.commercialName,
  (newVal) => {
    if (newVal !== formData.value.companyName) {
      isCompanyNameSynced.value = false
    }
  }
) */

const errors = ref({
  companyName: '',
  commercialName: '',
  phone: '',
  cif: '',
  preferredLocations: '',
  sector: '',
  termsAccepted: '',
})

const submitForm = async () => {
  console.log(formData.value)
  if (formData.value.termsAccepted) {
    errors.value = {
      companyName: '',
      commercialName: '',
      phone: '',
      cif: '',
      preferredLocations: '',
      sector: '',
      termsAccepted: '',
    }
    if (!validateForm()) return false
    if (!validateCIF(formData.value.cif) && !validateNifNie(formData.value.cif) ) return (errors.value.cif = t('onBoarding.step2InvalidCIF'))
    
    if (formData.value.sector !== 'restoration') delete formData.value.type
    if (formData.value.sector !== 'services') delete formData.value.serviceType
    try {
      const userId = userStore.userData._id
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
        toast({
        description: t('newsletter.error'),
        variant: 'destructive'
      });
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
  })
  return Object.values(errors.value).every((error) => error === '')
}


</script>

<style scoped>
input:checked {
  border: none;
  background: red;
}
</style>
