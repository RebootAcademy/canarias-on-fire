<template>
  <div class="flex !flex-col min-h-screen w-screen xs:p-6 sm:p-14 lg:p-8 lg:px-24">
    <div v-if="currentStep === 1" class="flex !flex-col">
      <h1 class="text-primary text-2xl font-bold mb-6">{{ $t('onBoarding.step1')}}</h1>
      <p class="mb-8 text-gray-400">
        {{ $t('onBoarding.step1Description')}}
      </p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8 md:px-12  lg:px-56 xl:px-72">
        <button 
          @click="selectRole('company')" 
          class="bg-gray   p-6 rounded-lg hover:bg-gray transition duration-300 flex flex-col items-center"
          :class="{
            'ring-2 ring-primary': selectedRole === 'company',
            'ring-1 ring-secondary': selectedRole !== 'company'
          }"
        >
          <!-- <img src="/path-to-company-icon.svg" alt="Company" class="w-16 h-16 mb-4"> -->
          <BriefcaseBusiness size="32" class="text-secondary mb-4"/>
          <h2 class="text-xl font-semibold mb-2">{{ $t('onBoarding.step1Company')}}</h2>
          <p class="text-gray-400 text-center">{{  $t('onBoarding.step1CompanyDescription') }}</p>
        </button>
        
        <button 
          @click="selectRole('band')" 
          class="bg-gray border-1  p-6 rounded-lg hover:bg-gray transition duration-300 flex flex-col items-center"
          :class="{
            'ring-2 ring-primary': selectedRole === 'band',
            'ring-1 ring-secondary': selectedRole !== 'band'
          }"
        >
          <!-- <img src="/path-to-band-icon.svg" alt="Music Band" class="w-16 h-16 mb-4"> -->
          <Music size="32" class="text-secondary mb-4" />
          <h2 class="text-xl font-semibold mb-2">{{ $t('onBoarding.step1MusicBand')}}</h2>
          <p class="text-gray-400 text-center">{{  $t('onBoarding.step1MusicBandDescription') }}</p>
        </button>
      </div>
      <div class="flex w-full justify-center">
        <div class="bg-primary-gradient md:w-1/5 rounded-sm p-0.5" v-if="selectedRole">
          <Button
            @click="continueToNextStep"
            variant="ghost"
            class="w-full bg-background text-secondary px-6 py-2 rounded-sm font-semibold transition duration-300 hover:bg-primary-gradient hover:text-white"
            :disabled="!selectedRole"
          >
            {{ $t('buttons.continue')}}
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
}

const goToStep = (step) => {
  currentStep.value = step
}

</script>