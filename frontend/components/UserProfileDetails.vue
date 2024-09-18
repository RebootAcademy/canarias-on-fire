<template>
  <div class="p-6">
    <div class="flex items-center space-x-6 mb-4">
      <div
        class="bg-gray-300 rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold text-white"
      >
        {{
          (editedUser.role === 'company'
            ? editedUser.companyName
            : editedUser.username
          )
            .charAt(0)
            .toUpperCase()
        }}
      </div>
      <div>
        <h3 class="text-xl font-semibold">
          {{
            editedUser.role === 'company'
              ? editedUser.companyName
              : editedUser.username
          }}
        </h3>
        <p class="text-gray-600">{{ editedUser.email }}</p>
        <p v-if="!editedUser.isActive" class="text-red-500 font-semibold">
          {{ $t('userProfile.desactivated')}}
        </p>
      </div>
    </div>

    <form @submit.prevent="updateUser">
      <div class="mb-4">
        <Label for="username" class="text-gray-300">{{$t('userProfile.userName')}}</Label>
        <Input
          id="username"
          v-model="editedUser.username"
          :disabled="!editedUser.isActive"
          class="text-gray-500"
        />
      </div>
      <div class="mb-4">
        <Label for="email" class="text-gray-300">{{$t('userProfile.email')}}</Label>
        <Input
          id="email"
          v-model="editedUser.email"
          :disabled="!editedUser.isActive"
          class="text-gray-500"
        />
      </div>
      <div 
        v-if="editedUser.role === 'company' && !checkValidatedCompany" 
        class="mb-4"
      >
        <Label for="cif" class="text-gray-300">{{$t('userProfile.cif')}}</Label>
        <Input
          id="email"
          v-model="editedUser.cif"
          :disabled="true"
          class="text-gray-500"
        />
      </div>
      <div class="mb-4">
        <Label class="mb-2 text-gray-300">{{$t('userProfile.role')}}</Label>
        <Select v-model="editedUser.role" :disabled="!editedUser.isActive">
          <SelectTrigger>
            <SelectValue :placeholder="$t('userProfile.selectedRole.label')" class="text-gray-500" />
          </SelectTrigger>
          <SelectContent class="text-gray-500">
            <SelectItem value="basic">{{$t('userProfile.selectedRole.basis')}}</SelectItem>
            <SelectItem value="company">{{$t('userProfile.selectedRole.company')}}</SelectItem>
            <SelectItem value="admin">{{$t('userProfile.selectedRole.admin')}}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <hr class="mb-6" />
      <!-- Company-specific fields -->
      <div v-if="editedUser.role === 'company'">
        <div class="mb-4">
          <Label for="companyName" class="text-gray-300">{{ $t('userProfile.companyName') }}</Label>
          <Input
            id="companyName"
            v-model="editedUser.companyName"
            :disabled="!editedUser.isActive"
            class="text-gray-500"
          />
        </div>
        <div class="mb-4">
          <Label for="companyEmail" class="text-gray-300">{{ $t('userProfile.email') }}</Label>
          <Input
            id="companyEmail"
            v-model="editedUser.companyEmail"
            :disabled="!editedUser.isActive"
            class="text-gray-500"
          />
        </div>
        <div class="mb-4">
          <Label for="phone" class="text-gray-300">{{ $t('userProfile.phone') }}</Label>
          <Input
            id="phone"
            v-model="editedUser.phone"
            :disabled="!editedUser.isActive"
            class="text-gray-500"
          />
        </div>
        <div class="mb-4">
          <Label for="sector" class="text-gray-300">{{$t('userProfile.sector.label')}}</Label>
          <Select v-model="editedUser.sector" :disabled="!editedUser.isActive">
            <SelectTrigger>
              <SelectValue :placeholder="$t('userProfile.sector.select') " class="text-gray-500" />
            </SelectTrigger>
            <SelectContent class="text-gray-500">
              <SelectItem value="restoration">{{$t('userProfile.sector.restoration')}}</SelectItem>
              <SelectItem value="services">{{$t('userProfile.sector.services')}}</SelectItem>
              <SelectItem value="nightlife">{{$t('userProfile.sector.nightlife')}}</SelectItem>
              <SelectItem value="activities">{{$t('userProfile.sector.activities')}}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div class="flex gap-4 mt-12">
        <Button @click="deleteUser" class="px-6" variant="destructive">
          {{ $t('buttons.delete') }}
        </Button>
        <Button
          v-if="checkValidatedCompany"
          @click="toggleUserActivation"
          variant="outline"
          class="text-gray-500"
        >
          {{ editedUser.isActive ? $t('buttons.desactivate') : $t('buttons.activate') }}
        </Button>
        <Button
          v-if="checkValidatedCompany"
          @click="updateUser"
          :disabled="!editedUser.isActive"
          class="px-6 hover:bg-orange-700"
        >
          {{ $t('buttons.update')}}
        </Button>
        <Button
          v-if="!checkValidatedCompany"
          @click="validateUser"
          :disabled="!editedUser.isActive"
          class="px-6 bg-green-700 hover:bg-green-800 text-white"
        >
          {{ $t('buttons.validate')}}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const userStore = useUserStore()
const editedUser = reactive({ ...props.user })

/* watch(() => props.user, (newUser) => {
  Object.assign(editedUser, newUser)
}, { deep: true }) */

watch(
  () => editedUser.role,
  (newRole, oldRole) => {
    if (newRole === 'company' && oldRole !== 'company') {
      // Inicializar campos de compañía si cambia a rol de compañía
      editedUser.companyName = editedUser.companyName || ''
      editedUser.companyEmail = editedUser.companyEmail || editedUser.email
      editedUser.phone = editedUser.phone || ''
      editedUser.sector = editedUser.sector || ''
    }
  }
)

const checkValidatedCompany = computed(() => {
  return editedUser.role === 'company' && editedUser.isValidated 
})

const updateUser = async () => {
  if (editedUser && editedUser._id) {
    const dataToUpdate = {
      ...editedUser,
      role: editedUser.role,
      // Incluir campos de compañía solo si el rol es 'company'
      ...(editedUser.role === 'company' && {
        companyName: editedUser.companyName,
        companyEmail: editedUser.companyEmail,
        phone: editedUser.phone,
        sector: editedUser.sector,
      }),
    }
    const result = await userStore.updateUserProfile(toRaw(dataToUpdate))
    if (result.success) {
      Object.assign(editedUser, result.user)
      router.push('/dashboard/users')
    }
  } else {
    console.error('Invalid user data for update')
  }
}

const validateUser = async () => {
   if (editedUser && editedUser._id) {
     const updateValidation = {
       ...editedUser,
       isValidated: true
     }

     console.log('updateValidation:', toRaw(updateValidation))
   
     const result = await userStore.updateUserProfile(toRaw(updateValidation)) 
     console.log(result)
     if (result.success) {
       Object.assign(editedUser, result.user)
       router.replace('/dashboard/users')
     }
   } else  {
        console.error('Invalid user data for update')
   }
}

const toggleUserActivation = async () => {
  editedUser.isActive = !editedUser.isActive
  const result = await userStore.updateUserProfile(toRaw(editedUser))
  if (result.success) {
    Object.assign(editedUser, result.user)
  }
}

const deleteUser = async () => {
  const result = await userStore.deleteUser(editedUser._id)
  if (result.success) {
    console.log('User deleted successfully')
    // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
    router.push('/dashboard')
  }
}
</script>
