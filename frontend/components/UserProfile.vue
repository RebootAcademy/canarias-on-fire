<template>
  <div v-if="user">
    <div class="flex items-center mb-6">
      <Button 
        @click="$emit('back')" 
        class="text-sm px-3"
        variant="transparent"
      >
        <ArrowLeft />
      </Button>
      <h2 class="text-2xl font-semibold">{{ user.username }}</h2>
    </div>
    <hr>
    <div class="p-6">
      <div class="flex items-center space-x-6 mb-4">
        <div class="bg-gray-300 rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold text-white">
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h3 class="text-xl font-semibold">{{ user.username }}</h3>
          <p class="text-gray-600">{{ user.email }}</p>
        </div>
      </div>
      <div class="mb-4">
        <Label for="username">Username</Label>
        <Input id="username" v-model="editedUser.username" class="mt-1 text-gray-500" />
      </div>
      <div class="mb-4">
        <Label for="email">Email</Label>
        <Input id="email" v-model="editedUser.email" class="mt-1 text-gray-500" />
      </div>
      <div class="flex gap-4 mt-12">
        <Button 
          @click="deleteUser" 
          class="px-6"
          variant="outline"
        >
          Delete
        </Button>
        <Button 
          @click="deactivateUser" 
          variant="secondary"
        >
          Deactivate
        </Button>
        <Button 
          @click="updateUser" 
          class="px-6"
        >
          Update
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'deactivate', 'delete', 'back'])

const editedUser = ref({ ...props.user })

const updateUser = () => {
  emit('update', editedUser.value)
}

const deactivateUser = () => {
  emit('deactivate', props.user._id)
}

const deleteUser = () => {
  emit('delete', props.user._id)
}
</script>