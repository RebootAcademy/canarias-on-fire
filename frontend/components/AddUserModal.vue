<template>
  <div v-if="isOpen" class="fixed inset-0 z-20 flex items-center justify-center">
    <div class="rounded-lg p-6 w-11/12 max-w-md bg-background border">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ $t('addUser') }}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="gap-4">
          <Label for="role">{{ $t('role') }}</Label>
          <Select v-model="formData.role">
            <SelectTrigger>
              <SelectValue
                :placeholder="$t('userProfile.selectedRole.label')"
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
          <div v-if="formData.role !== 'company'" class="gap-4">
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
            <Label for="password">{{ $t('password') }}</Label>
            <Input
              id="text"
              v-model="formData.password"
              type="text"
              required
              class="text-gray-500"
            />
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
            <p
              v-if="errorCompany.companyName"
              class="text-red-500 text-sm mt-1 italic"
            >
              {{ errorCompany.companyName }}
            </p>
            <div class="gap-4">
              <Label for="companyEmail">{{
                $t('userProfile.commercialName')
              }}</Label>
              <Input
                id="commercialName"
                v-model="formData.commercialName"
                type="text"
                required
                class="text-gray-500"
              />
            </div>
            <p
              v-if="errorCompany.commercialName"
              class="text-red-500 text-sm mt-1 italic"
            >
              {{ errorCompany.commercialName }}
            </p>
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
            <p
              v-if="errorCompany.companyEmail"
              class="text-red-500 text-sm mt-1 italic"
            >
              {{ errorCompany.companyEmail }}
            </p>
            <div class="gap-4">
              <Label for="cif">{{ $t('userProfile.cif') }}</Label>
              <Input
                id="cif"
                v-model="formData.cif"
                type="text"
                required
                class="text-gray-500"
              />
            </div>
            <p v-if="errorCompany.cif" class="text-red-500 text-sm mt-1 italic">
              {{ errorCompany.cif }}
            </p>
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
              class="text-secondary bg-background hover:bg-primary-gradient hover:text-white"
              >{{ $t('buttons.create') }}</Button
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import createUserAndAssignRole from '@/middleware/auth.user.js'
const props = defineProps({
  isOpen: Boolean,
})
const { t } = useI18n()
const userStore = useUserStore()
const { users } = userStore
const isCompanyNameSynced = ref(true)

const emit = defineEmits(['close', 'userAdded'])

const subscriptionStore = useSubscriptionStore()
const subscriptions = ref([])

onMounted(async () => {
  await subscriptionStore.fetchSubscriptions()
  subscriptions.value = subscriptionStore.subscriptions
})

const formData = ref({
  username: '',
  email: '',
  password: 'Eventes.1234',
  role: 'basic',
  companyName: '',
  companyEmail: '',
  cif: '',
  commercialName: '',
  phone: '',
  sector: '',
})

const errorCompany = ref({
  cif: '',
  companyName: '',
  commercialName: '',
  companyEmail: '',
})

watch(
  () => formData.value?.role,
  (newValue) => {
    console.log(newValue)
  }
)

const isFormValid = computed(() => {
  if (users.some((user) => user.email === formData.value.email)) {
    console.log('Aquí en el primero')

    return false
  }
  if (
    formData.value.role !== 'company' &&
    (!formData.value.username || !formData.value.email || !formData.value.role)
  ) {

    return false
  }
  errorCompany.value = {
    cif: '',
    companyName: '',
    commercialName: '',
    companyEmail: '',
  }
  if (formData.value.role === 'company') {
    if (!validateCIF(formData.value.cif)) {
      errorCompany.value.cif = 'El CIF introducido no es válido'
      return false
    }
    if (
      users.some((user) => user.companyEmail === formData.value.companyEmail)
    ) {
      errorCompany.value.companyEmail =
        'El email introducido ya ha sido registrado'
      return false
    }
    if (users.some((user) => user.cif === formData.value.cif)) {
      errorCompany.value.cif = 'El CIF introducido ya ha sido registrado'
      return false
    }
    if (users.some((user) => user.companyName === formData.value.companyName)) {
      errorCompany.value.companyName =
        'El nombre de la empresa introducido ya ha sido registrado'
      return false
    }
    if (
      users.some(
        (user) => user.commercialName === formData.value.commercialName
      )
    ) {
      errorCompany.value.commercialName =
        'El nombre comercial introducido ya ha sido registrado'
      return false
    }
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
  /* 
    if (!isAuthenticated.value) {
      console.error('Usuario no autenticado');
      return; // O maneja la autenticación como consideres
} */
  console.log(isFormValid.value)
  if (isFormValid.value) {
    const userData = { ...formData.value }
    await createUserAndAssignRole(userData)

    if (userData.role === 'company') {
      if (!validateCIF(formData.value.cif))
        return (errors.value.cif = t('onBoarding.step2InvalidCIF'))

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
    delete userData.password
    emit('userAdded', userData)

    closeModal()
  }
}
</script>
