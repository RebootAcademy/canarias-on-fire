<template>
  <div class="min-h-screen p-8">
    <div v-if="currentStep === 1" class="flex flex-col">
      <h1 class="text-primary text-2xl font-bold mb-6">STEP 1 of 2: Select your rol</h1>
      <p class="mb-8 text-gray-400">
        To get started, please select the role that best describes you. This choice will allow us to personalize your experience and request the specific information we need to create your account.
      </p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <button 
          @click="selectRole('company')" 
          class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition duration-300 flex flex-col items-center"
          :class="{ 'ring-2 ring-orange-500': selectedRole === 'company' }"
        >
          <!-- <img src="/path-to-company-icon.svg" alt="Company" class="w-16 h-16 mb-4"> -->
          <h2 class="text-xl font-semibold mb-2">I'm a company</h2>
          <p class="text-gray-400 text-center">Promote your brand, share your products, and showcase your new releases.</p>
        </button>
        
        <button 
          @click="selectRole('band')" 
          class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition duration-300 flex flex-col items-center"
          :class="{ 'ring-2 ring-orange-500': selectedRole === 'band' }"
        >
          <!-- <img src="/path-to-band-icon.svg" alt="Music Band" class="w-16 h-16 mb-4"> -->
          <h2 class="text-xl font-semibold mb-2">I'm a music band</h2>
          <p class="text-gray-400 text-center">Promote your music, reach a wider audience, and manage your event logistics.</p>
        </button>
      </div>
      
      <Button 
        @click="continueToNextStep"
        variant="secondary"
        class="text-black px-6 py-2 rounded-full font-semibold transition duration-300"
        :disabled="!selectedRole"
      >
        CONTINUE
      </Button>
    </div>
    <div v-else-if="currentStep === 2">
      <CompanyDetailsForm v-if="selectedRole === 'company'" />
      <BandDetailsForm v-else-if="selectedRole === 'band'" />
    </div>
  </div>
</template>

<script setup>
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
</script>