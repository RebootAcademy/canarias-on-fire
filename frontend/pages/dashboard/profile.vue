<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">{{ $t('userProfile.profile') }}</h2>
    <hr class="mb-4" />
    <div v-if="userStore.isAuthenticated">
      <div class="flex items-center mb-4">
        <Avatar>
          <AvatarImage
            :src="userStore.userData?.profileImg"
            alt="User Avatar"
          />
          <AvatarFallback>{{ formData.username?.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div class="ml-4">
          <h3 v-if="userRole !== 'company'" class="text-lg font-semibold">
            {{ formData.username }}
          </h3>
          <h3 v-if="userRole === 'company'" class="text-lg font-semibold">
            {{ formData.companyName }}
          </h3>
        </div>
      </div>
      <form @submit.prevent="updateProfile">
        <div class="mb-4">
          <Label class="block text-sm font-medium text-gray-300">{{
            $t('userProfile.userImage')
          }}</Label>
          <Input type="file" @change="handleFileChange" accept="image/*" />
          <Button
            type="button"
            @click="uploadImage"
            class="mt-2 bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1"
          >
            {{ $t('buttons.upload') }}
          </Button>
        </div>
        <div v-if="userRole !== 'company'" class="mb-4">
          <Label class="block text-sm font-medium text-gray-300">{{
            $t('userName')
          }}</Label>
          <Input
            class="mt-1 block w-full text-gray-500"
            v-model="formData.username"
          />
        </div>
        <div v-if="userRole === 'company'" class="mb-4">
          <Label class="block text-sm font-medium text-gray-300">{{
            $t('userProfile.companyName')
          }}</Label>
          <Input
            class="mt-1 block w-full text-gray-500"
            v-model="formData.companyName"
          />
        </div>
        <div v-if="userRole === 'company'" class="mb-4">
          <Label class="block text-sm font-medium text-gray-300">{{
            $t('userProfile.commercialName')
          }}</Label>
          <Input
            class="mt-1 block w-full text-gray-500"
            v-model="formData.commercialName"
          />
        </div>
        <div class="mb-4">
          <Label class="block text-sm font-medium text-gray-300">{{
            $t('email')
          }}</Label>
          <Input
            class="mt-1 block w-full text-gray-500"
            v-model="formData.email"
          />
        </div>
        <div
          v-if="userRole === 'company'"
          class="flex flex-col gap-2 sm:flex-row sm:gap-4 sm w-full mb-4"
        >
          <div>
            <Label class="block text-sm font-medium text-gray-300">{{
              $t('userProfile.cif')
            }}</Label>
            <Input
              class="mt-1 block w-full text-gray-500"
              v-model="formData.cif"
            />
          </div>
          <div>
            <Label class="block text-sm font-medium text-gray-300">{{
              $t('onBoarding.step2ZIP')
            }}</Label>
            <Input
              class="mt-1 block w-full text-gray-500"
              v-model="formData.postalCode"
            />
          </div>
          <div>
            <Label class="block text-sm font-medium text-gray-300">{{
              $t('onBoarding.step2Phone')
            }}</Label>
            <Input
              class="mt-1 block w-full text-gray-500"
              v-model="formData.phone"
            />
          </div>
        </div>

        <Button
          @click="isOpen = true"
          :disabled="isUpdating"
          class="bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1"
        >
          {{ isUpdating ? $t('buttons.updating') : $t('buttons.update') }}
        </Button>

        <div
          v-if="userStore.userData.role === 'musician'"
          class="mb-4 mt-2 w-full lg:w-1/2"
        >
          <CreateNextPerformance />
        </div>
      </form>
    </div>
    <div v-else>
      <p>Please log in to view your profile.</p>
    </div>
  </div>
  <CustomModal v-model:open="isOpen">
    <p class="font-bold text-2xl">{{ $t('areYouSure') }}</p>
    <p class="text-lg">{{ $t('changeMyProfile') }}</p>
    <div class="flex justify-end gap-4 mt-2">
      <button
        @click="isOpen = false"
        class="font-bold p-2 px-6 rounded-md bg-gray hover:bg-red-500"
      >
        {{ $t('buttons.cancel') }}
      </button>
      <CustomBtn :title="$t('buttons.confirm')" @action="updateProfile" />
    </div>
  </CustomModal>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const { t } = useI18n()
const isOpen = ref(false)

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'User Profile',
})

const { user, isAuthenticated } = useAuth0()
const userStore = useUserStore()
const userRole = computed(() => userStore.userData?.role)

const formData = reactive({
  _id: userStore.userData?._id,
  username: userStore.userData?.username || '',
  companyName: userStore.userData?.companyName || '',
  commercialName: userStore.userData?.commercialName || '',
  email: userStore.userData?.email || '',
  cif: userStore.userData?.cif || '',
  phone: userStore.userData?.phone || '',
  postalCode: userStore.userData?.postalCode || '',
  profileImg: userStore.userData?.profileImg || '',
})

const isUpdating = ref(false)
const selectedFile = ref(null)

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadImage = async () => {
  console.log()
  if (!selectedFile.value) {
    console.error('No file selected')
    return
  }
  const config = useRuntimeConfig()

  const cloudName = config.public.cloudinaryCloudName
  const uploadPreset = config.public.cloudinaryUploadPreset

  const formDataForUpload = new FormData()
  formDataForUpload.append('file', selectedFile.value)
  formDataForUpload.append('upload_preset', uploadPreset)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formDataForUpload,
      }
    )

    const data = await response.json()
    if (data.secure_url) {
      formData.profileImg = data.secure_url
      updateProfile()
    }
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

async function updateProfile() {
  isUpdating.value = true
  isOpen.value = false
  try {
    const dataToUpdate = { ...formData, _id: userStore.userData?._id }
    const result = await userStore.updateUserProfile(dataToUpdate)
    if (result.success) {
      toast({
        description: t('updatedProfile'),
      })
      userStore.userData = result.user
    } else {
      toast({
        description: t('errorUpdatedProfile'),
        variant: 'destructive',
      })
    }
  } finally {
    isUpdating.value = false
  }
}
</script>
