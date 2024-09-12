<template>
  <div class="flex flex-col w-full items-center p-6">
    <div class="flex flex-col w-full items-start">
      <div class="flex items-center">
        <ArrowLeft
          size="24"
          @click="$emit('back')"
          class="text-yellow-500 cursor-pointer"
        />
        <h1 class="text-2xl font-bold text-primary">
          {{ $t('onBoarding.step2Band') }}
        </h1>
      </div>
      <p class="text-gray-400 mb-8">
        {{ $t('onBoarding.step2BandDescription') }}
      </p>
    </div>
    <div
      class="flex flex-col justify--center mb-4 border-2 border-gray rounded-md p-4 sm:w-full md:w-2/3 lg:w-1/2"
    >
      <ImageUploader @image-uploaded="handleImageUpload" />
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <Label class="text-gray-300"
            >{{ $t('onBoarding.step2BandName')
            }}<span class="text-primary">*</span></Label
          >
          <Input
            id="bandName"
            v-model="formData.bandName"
            class="text-gray-500"
            required
          />
          <p v-if="errors.bandName" class="text-red-500 text-sm mt-1 italic">
            {{ errors.bandName }}
          </p>
        </div>
        <div class="mb-4">
          <Label class="text-gray-300"
            >{{ $t('onBoarding.step2Email')
            }}<span class="text-primary">*</span></Label
          >
          <Input
            id="email"
            v-model="formData.email"
            type="email"
            class="text-gray-500"
            required
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1 italic">
            {{ errors.email }}
          </p>
        </div>
        <div class="mb-4">
          <Label class="text-gray-300"
            >{{ $t('onBoarding.step2Phone')
            }}<span class="text-primary">*</span></Label
          >
          <Input
            id="phone"
            v-model="formData.phone"
            class="text-gray-500"
            required
          />
        </div>
        <div class="mb-4">
          <Label class="text-gray-300"
            >{{ $t('onBoarding.step2Genres.label') }}
            <span class="text-primary">*</span></Label
          >
          <Select v-model="formData.genre" required>
            <SelectTrigger>
              <SelectValue
                :placeholder="$t('onBoarding.step2SelectGenres')"
                class="text-gray-500"
              />
            </SelectTrigger>
            <SelectContent class="text-gray-500">
              <SelectItem value="rock">{{
                $t('onBoarding.step2Genres.rock')
              }}</SelectItem>
              <SelectItem value="pop">{{
                $t('onBoarding.step2Genres.pop')
              }}</SelectItem>
              <SelectItem value="jazz">{{
                $t('onBoarding.step2Genres.jazz')
              }}</SelectItem>
              <SelectItem value="electronic">{{
                $t('onBoarding.step2Genres.electronic')
              }}</SelectItem>
              <SelectItem value="hiphop">{{
                $t('onBoarding.step2Genres.hiphop')
              }}</SelectItem>
              <SelectItem value="metal">{{
                $t('onBoarding.step2Genres.metal')
              }}</SelectItem>
              <SelectItem value="indie">{{
                $t('onBoarding.step2Genres.indie')
              }}</SelectItem>
              <SelectItem value="other">{{
                $t('onBoarding.step2Genres.other')
              }}</SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.genre" class="text-red-500 text-sm mt-1 italic">
            {{ errors.genre }}
          </p>
        </div>
        <div class="mb-4">
          <Label class="text-gray-300"
            >{{ $t('onBoarding.step2BandMembers') }}
            <span class="text-primary">*</span></Label
          >
          <Input
            id="members"
            v-model="formData.members"
            class="text-gray-500"
            :placeholder="$t('onBoarding.step2BandMembersPlaceholder')"
            required
          />
        </div>
        <div class="mb-4">
          <Label class="text-gray-300">{{ $t('onBoarding.step2Bio') }}</Label>
          <Textarea
            id="bio"
            v-model="formData.bio"
            class="text-gray-500"
            rows="4"
          />
        </div>
        <div class="w-full flex flex-col gap-2 mb-8">
          <label class="text-gray-300">{{
            $t('onBoarding.socialMedia.label')
          }}</label>

          <!-- Instagram Input Section -->
          <div class="flex flex-row items-center mt-2 gap-4">
            <Instagram
              class="w-6 h-6"
              :class="{ 'text-primary': formData.socialMedia.instagram !== '' }"
            />
            <Input
              id="instagram"
              v-model="formData.socialMedia.instagram"
              class="text-gray-500"
              :placeholder="$t('onBoarding.socialMedia.instagramPlaceholder')"
            />
          </div>
          <!-- 
          <div class="flex flex-row items-center gap-4">
            <Facebook
              class="w-6 h-6"
              :class="{ 'text-primary': formData.socialMedia.facebook !== '' }"
            />
            <Input
              id="facebook"
              v-model="formData.socialMedia.facebook"
              class="text-gray-500"
              :placeholder="$t('onBoarding.socialMedia.facebookPlaceholder')"
            />
          </div>

          <div class="flex flex-row items-center gap-4">
            <Youtube
              class="w-6 h-6"
              :class="{ 'text-primary': formData.socialMedia.youtube !== '' }"
            />
            <Input
              id="youtube"
              v-model="formData.socialMedia.youtube"
              class="text-gray-500"
              :placeholder="$t('onBoarding.socialMedia.youtubePlaceholder')"
            />
          </div> -->
        </div>
        <hr />
        <div class="mb-4 mt-2">
          <Label class="text-gray-300 font-bold text-lg">{{
            $t('bandNextPerformance')
          }}</Label>
          <div class="flex flex-col gap-1 mt-2">
            <p>{{ $t('eventLocation') }}</p>
            <p class="text-xs text-gray-500 mb-2">
              {{ $t('eventLocationDescription') }}
            </p>
            <LocationSearch @locationChanged="handleLocationChange" />
          </div>
          <div class="w-full flex flex-row gap-2">
            <div class="w-1/2 md:w-2/3">
              <DatePicker :band="true" @dateChanged="handleDateChange" />
            </div>
            <div class="w-1/2 md:w-1/3">
              <TimePicker
                id="startTime"
                label="Start time"
                v-model="formData.nextPerformance.startTime"
              />
            </div>
          </div>
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
      <div></div>
    </div>
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
</template>

<script setup>
import { ArrowLeft, Instagram, Facebook, Youtube } from 'lucide-vue-next'
const { t } = useI18n()

const formData = ref({
  bandName: '',
  email: '',
  phone: '',
  genre: '',
  members: '',
  bio: '',
  socialMedia: {
    instagram: '',
    facebook: '',
    youtube: '',
  },
  nextPerformance: {
    date: '', // Asigna una cadena vacía
    location: '',
    startTime: '',
  },
  termsAccepted: false,
  imageUrl: '',
})

const errors = ref({
  bandName: '',
  email: '',
  genre: '',
  termsAccepted: '',
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

const handleLocationChange = (locationData) => {
  formData.value.nextPerformance.location = locationData
}

const handleDateChange = (date) => {
  formData.value.nextPerformance.date = date
}


const submitForm = async () => {
  console.log(formData.value.termsAccepted)
  if (formData.value.termsAccepted) {
    errors.value = {
      bandName: '',
      email: '',
      genre: '',
      termsAccepted: '',
    }
    
    if (!validateForm()) return false
    try {
      const userId = userStore.userData._id
      console.log('User ID being sent:', userId)
      if (!userId) {
        console.error('User ID is undefined or null')
        return
      }

      console.log(formData.value)
      const result = await userStore.updateUserProfileToBand({
        ...formData.value,
        _id: userId,
        role: 'musician',
      })
      if (result.success) {
        router.push('/dashboard/profile')
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
