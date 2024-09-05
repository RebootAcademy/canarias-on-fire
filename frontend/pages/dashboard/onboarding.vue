<template>
  <div class="flex !flex-col min-h-screen w-screen xs:p-10 sm:p-14 lg:p-8 lg:px-24">
    <div v-if="currentStep === 1" class="flex !flex-col">
      <h1 class="text-primary text-2xl font-bold mb-6">STEP 1 of 2: Select your rol</h1>
      <p class="mb-8 text-gray-400">
        To get started, please select the role that best describes you. This choice will allow us to personalize your experience and request the specific information we need to create your account.
      </p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <button 
          @click="selectRole('company')" 
          class="bg-gray   p-6 rounded-lg hover:bg-gray transition duration-300 flex flex-col items-center"
          :class="{
            'ring-2 ring-primary': selectedRole === 'company',
            'ring-1 ring-white': selectedRole !== 'company'
          }"
        >
          <!-- <img src="/path-to-company-icon.svg" alt="Company" class="w-16 h-16 mb-4"> -->
          <BriefcaseBusiness size="32" class="text-white mb-4"/>
          <h2 class="text-xl font-semibold mb-2">I'm a company</h2>
          <p class="text-gray-400 text-center">Promote your brand, share your products, and showcase your new releases.</p>
        </button>
        
        <button 
          @click="selectRole('band')" 
          class="bg-gray border-1  p-6 rounded-lg hover:bg-gray transition duration-300 flex flex-col items-center"
          :class="{
            'ring-2 ring-primary': selectedRole === 'band',
            'ring-1 ring-white': selectedRole !== 'band'
          }"
        >
          <!-- <img src="/path-to-band-icon.svg" alt="Music Band" class="w-16 h-16 mb-4"> -->
          <Music size="32" class="text-white mb-4" />
          <h2 class="text-xl font-semibold mb-2">I'm a music band</h2>
          <p class="text-gray-400 text-center">Promote your music, reach a wider audience, and manage your event logistics.</p>
        </button>
      </div>
      <div class="flex w-full justify-center">
        <div class="bg-primary-gradient md:w-1/5 rounded-sm p-0.5">
          <Button 
            @click="continueToNextStep"
            variant="ghost"
            class="w-full bg-black text-whitepx-6 py-2 rounded-sm font-semibold transition duration-300 hover:bg-primary-gradient hover:text-white"
            :disabled="!selectedRole"
          >
            CONTINUE
          </Button>
  
        </div>

      </div>
    </div>
    <div v-else-if="currentStep === 2">
      <CompanyDetailsForm v-if="selectedRole === 'company'" @back="goToStep(1)"/>
      <BandDetailsForm v-else-if="selectedRole === 'band'"  @back="goToStep(1)" />
    </div>
  </div>
</template>

<script setup>
import { BriefcaseBusiness, Music } from 'lucide-vue-next'


const currentStep = ref(1)
const selectedRole = ref(null)

const selectRole = (role) => {
  selectedRole.value = role
}

const continueToNextStep = () => {
  if (selectedRole.value) {
    currentStep.value = 2
  }

  console.log(currentStep.value)
}

const goToStep = (step) => {
  console.log('CLICK')
  currentStep.value = step
}

</script>