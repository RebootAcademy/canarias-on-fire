<template>
  <div class="w-full flex flex-col gap-2 items-center justify-center py-8 px-4 md:px-0">
    <h1 class="text-4xl font-bold mb-2">{{ $t('contact.title') }}</h1>
    <p>
      {{ $t('contact.description') }}
    </p>
    <form class="flex flex-col gap-4 items-start mt-4 w-full  md:w-2/3 xl:w-1/3">
      <div class="flex flex-col w-full md:flex-row md:gap-4">
        <div class="flex flex-col gap-1 w-full md:w-1/2">
          <label for="firstName">{{ $t('contact.firstname') }}</label>
          <Input
            v-model="contactMail.firstName"
            type="text"
            id="firstName"
            class="p-2 border rounded-lg mb-1"
          />
          <span 
            v-if="contactErrors.firstName" 
            class="text-red-500 text-sm"
          >
            {{ contactErrors.firstName }}
          </span>
        </div>
        <div class="flex flex-col gap-1 w-full md:w-1/2">
          <label for="lastName">{{ $t('contact.lastname') }}</label>
          <Input
            v-model="contactMail.lastName"
            type="text"
            id="lastName"
            class="p-2 border rounded-md mb-1"
          />
          <span 
            v-if="contactErrors.lastName" 
            class="text-red-500 text-sm"
          >
            {{ contactErrors.lastName }}
          </span>
        </div>
      </div>
      <div class="flex flex-col w-full md:flex-row md:gap-4">
        <div class="flex flex-col gap-1 w-full md:w-1/2">
          <label for="email">{{ $t('contact.email') }}</label>
          <Input
            v-model="contactMail.email"
            type="text"
            id="email"
            required
            class="p-2 border rounded-lg mb-1"
          />
          <span 
            v-if="contactErrors.email" 
            class="text-red-500 text-sm"
          >
            {{ contactErrors.email }}
          </span>
        </div>
        <div class="flex flex-col gap-1 w-full md:w-1/2">
          <label for="phone">{{ $t('contact.phone') }}</label>
          <Input
            v-model="contactMail.phone"
            type="text"
            id="phone"
            class="p-2 border rounded-md mb-1"
          />
          <span 
            v-if="contactErrors.phone" 
            class="text-red-500 text-sm"
          >
            {{ contactErrors.phone }}
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-1 w-full">
        <label for="subject">{{ $t('contact.subject') }}</label>
        <Input
          v-model="contactMail.subject"
          type="text"
          id="subject"
          class="p-2 border rounded-md mb-1"
        />
        <span 
            v-if="contactErrors.subject" 
            class="text-red-500 text-sm"
          >
            {{ contactErrors.subject }}
          </span>
      </div>
      <div class="flex flex-col gap-1 w-full">
        <label for="message">{{ $t('contact.message') }}</label>
        <Textarea
          v-model="contactMail.message"
          type="text"
          id="message"
          class="p-2 border rounded-md mb-1 textarea-limited"
        />
        <span 
            v-if="contactErrors.message" 
            class="text-red-500 text-sm"
          >
            {{ contactErrors.message }}
          </span>
      </div>
    </form>
    <div class="flex w-full md:w-2/3 xl:w-1/3 justify-end">
      <CustomBtn title="Send" :action="sendMail" extraStyles="w-20" />
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

const config = useRuntimeConfig();
const {toast} = useToast()
const {userData} = useUserStore()
const {t} = useI18n()


const contactMail = ref({
  firstName: '',
  lastName: '',
  email: userData?.email ? userData?.email :'',
  phone: userData?.firstName ? userData?.firstName :'',
  subject: '',
  message: '',
});

const contactErrors = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
});

async function sendMail() {
  contactErrors.value = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

  let hasError = false;
  for (const [key, value] of Object.entries(contactMail.value)) {
    if (!value) {
      contactErrors.value[key] = t(`contact.error${key}Required`);
      hasError = true;
    }
  }

  if (hasError) return false 

  try {

    const { data, error } = await useFetch(`${config.public.apiBaseUrl}/users/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactMail.value),
    });

    if (error.value) {
      console.error('Error sending message:', error.value);
      toast({
        description: t('errorContactMailSent'),
        variant: 'destructive'
      })
    } else {
      contactMail.value = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      };
      toast({
        description: t('contactMailSent'),
       
      })
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    toast({
        description: t('errorContactMailSent'),
        variant: 'destructive'
      })
  }
}


</script>

<style scoped>
.textarea-limited {
  width: 100%;
  height: 200px;
  max-height: 200px;
  overflow-y: auto;
  resize: none;
}

.textarea-limited::-webkit-scrollbar {
  width: 8px; /* Ancho del scrollbar */
}

.textarea-limited::-webkit-scrollbar-track {
  background: none; /* Color del fondo del track */
}

.textarea-limited::-webkit-scrollbar-thumb {
  background-color: #fbb03b; /* Color del thumb (la parte que se arrastra) */
  border-radius: 10px; /* Redondeo del thumb */
}

.textarea-limited::-webkit-scrollbar-thumb:hover {
  background: #f15a24; /* Color del thumb al hacer hover */
}
</style>
