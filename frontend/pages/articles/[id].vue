<template>
  <div class="flex mx-auto px-4 py-8 bg-background">
    <div class="flex-grow ">
      <div v-if="article" class="max-w-4xl">
        <h1 class="text-3xl font-bold mb-4">{{ article.title }}</h1>
        <div class="flex items-center mb-4">
          <Avatar
            :src="article.userId?.profileImg ? article.userId?.profileImg : '/v_logo.png.png'"
            alt="Author Image"
            class="w-10 h-10 rounded-full mr-4"
          />
          <div>
            <p class="font-semibold">{{ article.userId?.username }}</p>
            <p class="text-sm text-gray-600">
              {{ formattedDate(article.date) }}
            </p>
          </div>
        </div>
        <img
          :src="article.coverImage"
          class="w-full h-64 object-cover mb-6 rounded-lg"
          alt="Article Image"
        />
        <div class="flex w-full justify-end mb-4 ">
           <Share2
           class="mr-2 w-8 cursor-pointer hover:text-primary"
            @click="copyToClipboard"
          />
        <Pencil
          v-if="isAdmin"
          class="mr-2 w-8 cursor-pointer hover:text-primary"
          @click="editArticle"
        />
        <Trash
          v-if="isAdmin"
          class="mr-2 w-8 cursor-pointer hover:text-red-500"
          @click="isOpen = true"
        />
        </div>
        <div class="prose max-w-none" v-html="article.content"></div>
        <ArticleGallery />
      </div>
      <div v-else class="text-center py-8">Loading article...</div>
     
    </div>
    <ArticleSidebar :articles="otherArticles" class="hidden md:block"/>
  </div>
  <CustomModal v-model:open="isOpen">
    <p class="font-bold text-2xl">{{ $t('areYouSure') }}</p>
    <p class="text-lg">
      {{  $t('deleteArticle') }}
    </p>
    <div class="flex justify-end gap-4 mt-2">
      <button
        @click="isOpen = false"
        class="font-bold p-2 px-6 rounded-md bg-gray hover:bg-red-500"
      >
        {{ $t('buttons.cancel') }}
      </button>
      <CustomBtn :title="$t('buttons.confirm')" @click="deleteArticle" />
    </div>
  </CustomModal>
</template>

<script setup>
import { Share2, Pencil, Trash } from 'lucide-vue-next'
const {t} = useI18n()
const route = useRoute()
const router = useRouter()
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const articleStore = useArticleStore()
const userStore = useUserStore()
const isOpen = ref(false)

const isAdmin = userStore.userData?.role === 'admin'
const { article } = storeToRefs(articleStore)

const articleId = route.params.id

useHead(() => ({
  title: article.value?.title || 'Evente',
  meta: [
    {
      name: 'description',
      content:
        article.value?.content
          ? article.value.content.replace(/<[^>]*>?/gm, '').slice(0, 155)
          : '',
    },
    { property: 'og:title', content: article.value?.title || 'Evente' },
    {
      property: 'og:description',
      content:
        article.value?.content
          ? article.value.content.replace(/<[^>]*>?/gm, '').slice(0, 155)
          : '',
    },
    { property: 'og:image', content: article.value?.coverImage || '/defaultImg.png' },
    { property: 'og:url', content: `https://evente.es/articles/${articleId}` },
    { property: 'og:type', content: 'article' },
  ],
  link: [{ rel: 'canonical', href: `https://evente.es/articles/${articleId}` }],
}))


onMounted(
  async () => (article.value = await articleStore.fetchArticleById(articleId))
)


const otherArticles = computed(() => {
  return articleStore.articles.filter((a) => a._id !== articleId)
})

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const editArticle = () => {
  router.push(`/articles/edit/${articleId}`)
}

const deleteArticle = async () => {
  const result = await articleStore.deleteArticle(articleId)
  if (result.success) {
    await articleStore.fetchArticles()
    router.push('/articles')
  } else {
    console.error(result.message)
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    toast({
      description: t('copyLink'),
    })
  } catch (err) {
    console.error('Error al copiar el enlace: ', err)
  }
}
</script>
