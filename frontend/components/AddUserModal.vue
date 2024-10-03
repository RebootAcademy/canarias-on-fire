<template>
  <div v-if="isOpen" class="fixed inset-0 z-2 flex items-center justify-center">
    <div class="rounded-lg p-6 w-11/12 max-w-md bg-background border">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ $t('addUser') }}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4 py-4">
          <div class="gap-4">
            <Label for="username">{{ $t('userName') }}</Label>
            <Input
              id="username"
              v-model="formData.username"
              required
              class="text-gray-500"
            />
          </div>
          <div class="gap-4">
            <Label for="email">{{ $t('email') }}</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="text-gray-500"
            />
          </div>
          <div class="gap-4">
            <Label for="role">{{ $t('role') }}</Label>
            <Select v-model="formData.role">
              <SelectTrigger>
                <SelectValue
                  :placeholder="t('userProfile.selectedRole.label')"
                />
              </SelectTrigger>
              <SelectContent class="text-gray-500">
                <SelectItem value="basic">{{
                  $t('userProfile.selectedRole.basis')
                }}</SelectItem>
                <SelectItem value="company">{{
                  $t('userProfile.selectedRole.company')
                }}</SelectItem>
                <SelectItem value="admin">{{
                  $t('userProfile.selectedRole.admin')
                }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <template v-if="formData.role === 'company'">
            <div class="gap-4">
              <Label for="companyName">{{
                $t('userProfile.companyName')
              }}</Label>
              <Input
                id="companyName"
                v-model="formData.companyName"
                required
                class="text-gray-500"
              />
            </div>
            <div class="gap-4">
              <Label for="companyEmail">{{ $t('userProfile.email') }}</Label>
              <Input
                id="companyEmail"
                v-model="formData.companyEmail"
                type="email"
                required
                class="text-gray-500"
              />
            </div>
            <div class="gap-4">
              <Label for="companyEmail">{{ $t('userProfile.commercialName') }}</Label>
              <Input
                id="commercialName"
                v-model="formData.commercialName"
                type="email"
                required
                class="text-gray-500"
              />
            </div>
            <div class="gap-4">
              <Label for="address">{{ $t('userProfile.cif') }}</Label>
              <Input
                id="cif"
                v-model="formData.cif"
                type="text"
                required
                class="text-gray-500"
              />
            </div>
            <div class="gap-4">
              <Label for="phone">{{ $t('userProfile.phone') }}</Label>
              <Input
                id="phone"
                v-model="formData.phone"
                class="text-gray-500"
              />
            </div>
            <div class="gap-4">
              <Label for="sector">{{ $t('userProfile.sector.label') }}</Label>
              <Select v-model="formData.sector" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent class="text-gray-500">
                  <SelectItem value="restoration">{{
                    $t('userProfile.sector.restoration')
                  }}</SelectItem>
                  <SelectItem value="services">{{
                    $t('userProfile.sector.services')
                  }}</SelectItem>
                  <SelectItem value="activities">{{
                    $t('userProfile.sector.activities')
                  }}</SelectItem>
                  <SelectItem value="nightlife">{{
                    $t('userProfile.sector.nightlife')
                  }}</SelectItem>
                  <SelectItem value="activities">{{
                    $t('userProfile.sector.activities')
                  }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </template>
        </div>
        <div class="flex justify-end gap-4 mt-6 z-10">
          <Button
            type="button"
            variant="ghost"
            @click="closeModal"
            class="bg-gray"
            >{{ $t('buttons.cancel') }}</Button
          >
          <div class="bg-primary-gradient p-0.5 rounded-md">
            <Button
              type="submit"
              variant="ghost"
              class="text-white bg-black hover:bg-primary-gradient hover:text-white"
              >{{ $t('buttons.accept') }}</Button
            >
          </div>
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

const subscriptionStore = useSubscriptionStore()
const subscriptions = ref([])

onMounted(async () => {
  await subscriptionStore.fetchSubscriptions()
  subscriptions.value = subscriptionStore.subscriptions
})

const formData = reactive({
  username: '',
  email: '',
  role: 'basic',
  companyName: '',
  companyEmail: '',
  cif: '',
  commercialName: '',
  phone: '',
  sector: '',
})

const isFormValid = computed(() => {
  if (!formData.username || !formData.email || !formData.role) return false
  if (formData.role === 'company') {
    return formData.companyName && formData.companyEmail && formData.sector
  }
  return true
})


watch(
  () => formData.value?.companyName,
  (newVal) => {
    if (isCompanyNameSynced.value) {
      formData.value.commercialName = newVal
    }
  }
)

watch(
  () => formData.value?.commercialName,
  (newVal) => {
    if (newVal !== formData.value.companyName) {
      isCompanyNameSynced.value = false
    }
  }
)

const closeModal = () => {
  emit('close')
  Object.keys(formData).forEach((key) => (formData[key] = ''))
  formData.role = 'basic'
}

const handleSubmit = async () => {
  if (isFormValid.value) {
    const userData = { ...formData }
    if (userData.role === 'company') {
      // Si no se proporciona companyEmail, usar el email principal
      userData.companyEmail = userData.companyEmail || userData.email
      // Encontrar la suscripción básica y asignar su ID
      const basicSubscription = subscriptionStore.getBasicSubscription()
      if (basicSubscription) {
        userData.subscription = basicSubscription._id
      } else {
        console.error('Basic subscription not found')
      }
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
