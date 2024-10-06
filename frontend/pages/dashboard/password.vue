  <template>
    <div class="flex flex-col gap-4 w-full md:w-1/3">
      <div class="flex flex-col gap-2">
        <Label for="password">Password</Label>
        <div class="relative">
          <Input
          id="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="password"
            :placeholder="$t('password')"
            class=" rounded-md p-2 w-full pr-10"
          />
          <div @click="togglePasswordVisibility" class="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Eye v-if="isPasswordVisible" size="20"/>
            <EyeOff v-else  size="20"/>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <Label for="confirm">{{ $t('confirmPassword') }}</Label>
         <div class="relative">
      
          <Input
          id="confirm"
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="confirmPassword"
            :placeholder="$t('confirmPassword')"
            class="rounded-md p-2 w-full pr-10"
          />
          <div @click="togglePasswordVisibility" class="absolute right-2 top-1/2 transform -translate-y-1/2">
             <Eye v-if="isPasswordVisible" size="20"/>
            <EyeOff v-else  size="20"/>
          </div>
        </div>
      </div>
      <p v-if="error" class="text-red-500 text-sm mt-1 italic">
        {{ error }}
      </p>
    </div>
    <p class="text-primary text-sm py-4">{{ $t('googleAccount') }}</p>
    <div class="flex w-full md:w-1/3">
      <CustomBtn
      :title="$t('buttons.update')"
      class="w-full md:w-1/2"
      :action="updatePassword"
      />

    </div>
</template>

<script setup>
import { Eye, EyeOff } from 'lucide-vue-next'
import changeUserPassword from '@/middleware/auth.password.js'
const {t} = useI18n()
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const userStore = useUserStore()

const password = ref('')
const confirmPassword = ref('')
const isPasswordVisible = ref(false)


const error = ref('')

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const updatePassword = async () => {
  error.value = ''
  if (password.value === confirmPassword.value) {
    await changeUserPassword(userStore.userData.email, password.value)
    toast({
      description: t('passwordChanged'),
    })
  } else {
    error.value = t('passwordsDontMatch')
  }

}

definePageMeta({
  layout: 'dashboard',
})
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>

