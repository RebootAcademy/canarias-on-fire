import { NuxtImg } from '../.nuxt/components';
<template>
  <div class="event-gallery p-4 rounded-lg">
    <h2 class="text-2xl text-secondary font-semibold mb-2">{{ $t('gallery.title')}}</h2>
    <div class="image-previews flex gap-4 overflow-x-auto">
      <div v-for="(article, index) in articleStore.article.articleImages" :key="index" class="image-preview relative">
        <img :src="article.url" @click="openModal(article.url)" class="w-32 h-32 object-cover rounded-lg cursor-pointer" />
      </div>
    </div>
    <ImageModal :isOpen="isModalOpen" :imageUrl="selectedImageUrl" @close="closeModal" />
  </div>
</template>

<script setup>
const articleStore = useArticleStore()
const isModalOpen = ref(false)
const selectedImageUrl = ref('')

const openModal = (url) => {
  selectedImageUrl.value = url
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedImageUrl.value = ''
}
</script>

<style scoped>
.image-previews {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
}
.image-preview {
  display: inline-block;
  flex: 0 0 auto; /* Prevent resizing */
}
.image-preview img {
  width: 128px; /* Fixed width */
  height: 128px; /* Fixed height */
  object-fit: cover;
  cursor: pointer;
}
</style>