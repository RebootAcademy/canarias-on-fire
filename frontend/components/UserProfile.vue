<template>
  <div v-if="user">
    <div class="flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between mb-6">
      <div class="flex items-center">
        <Button @click="$emit('back')" class="text-sm px-3" variant="transparent">
          <ArrowLeft />
        </Button>
        <h2 class="text-2xl font-semibold">        
          {{ user.role === 'company' ? user.companyName : user.username }}
        </h2>
      </div>

      <Tabs v-if="user.role === 'company'" v-model="activeTab" class="w-auto" @update:modelValue="onTabChange">
        <TabsList>
          <TabsTrigger value="profile" class="text-secondary" :class="activeTab === 'profile' ? 'text-primary' : 'text-gray'">{{ $t('userProfile.profile') }}</TabsTrigger>
          <TabsTrigger value="events" :class="activeTab === 'events' ? 'text-primary' : 'text-gray'">{{ $t('userProfile.events') }}</TabsTrigger>
          <TabsTrigger value="subscriptions" :class="activeTab === 'subscriptions' ? 'text-primary' : 'text-gray'">{{ $t('userProfile.subscriptions') }}</TabsTrigger>
        </TabsList>
      </Tabs>

    </div>
    <hr />
    <UserProfileDetails 
      v-if="activeTab === 'profile'" 
      @back="onBack"
      :user="user"
    />
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['back', 'tabChange'])

const activeTab = ref('profile')

const onTabChange = (newTab) => {
  emit('tabChange', newTab)
}

const onBack = () => {
  emit('back')
};

watch(activeTab, (newTab) => {
  emit('tabChange', newTab)
})
</script>