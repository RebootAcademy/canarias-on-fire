// stores/articleStore.js
import { defineStore } from 'pinia'

export const useArticleStore = defineStore('articleStore', {
  state: () => ({
    articles: [],
    article: {
      articleImages: [],
      coverImage: null,
    },
    title: '',
    content: '',
    articleImages: [],
    coverImage: null,
    filteredArticles: [],
    searchQuery: '',
    selectedCategory: null,
    filterModalOpen: false,
    isLoading: false,
    error: null
  }),

  actions: {
    addArticleImage(image) {
      this.articleImages.push(image)
    },

    removeArticleImage(url) {
      this.articleImages = this.articleImages.filter(image => image.url !== url)
    },

    setCoverImage(url) {
      this.coverImage = url
    },
    async fetchArticles() {
      this.isLoading = true
      this.error = null
      try {
        const data = await $fetch(`${config.public.apiBaseUrl}/articles`)
        this.articles = data.result || []
      } catch (error) {
        this.error = error
      } finally {
        this.isLoading = false
      }
    },

    async fetchArticleById(articleId) {
      try {
        const data = await $fetch(
          `${config.public.apiBaseUrl}/articles/${articleId}`
        )
        if (data && data.result) {
          this.setArticle(data.result)
          return data.result
        }
        throw new Error('Article not found')
      } catch (error) {
        throw error
      }
    },

    async createArticle(articleData) {
      const config = useRuntimeConfig()
      try {
        const response = await $fetch(`${config.public.apiBaseUrl}/articles`, {
          method: 'POST',
          body: articleData
        })
        if (response && response.result) {
          this.articles.push(response.result)
          this.updateFilteredArticles()
          return { success: true, message: response.result }
        } else {
          throw new Error(response.message || 'Failed to create article')
        }
      } catch (error) {
        console.error('Error creating article:', error)
        throw error
      }
    },

    async updateArticle(articleId, articleData) {
      const config = useRuntimeConfig()
      try {
        const response = await $fetch(`${config.public.apiBaseUrl}/articles/${articleId}`, {
          method: 'PATCH',
          body: articleData
        })
        if (response && response.result) {
          const index = this.articles.findIndex(article => article._id === articleId)
          if (index !== -1) {
            this.articles[index] = response.result
            this.updateFilteredArticles()
          }
          return { success: true, article: response.result }
        } else {
          throw new Error(response.message || 'Failed to update article')
        }
      } catch (error) {
        console.error('Error updating article:', error)
        throw error
      }
    },

    async deleteArticle(articleId) {
      const config = useRuntimeConfig()

      try {
        const response = await $fetch(`${config.public.apiBaseUrl}/articles/${articleId}`, {
          method: 'DELETE',
        })
        if (response && response.success) {
          this.articles = this.articles.filter(article => article._id !== articleId)
          this.updateFilteredArticles()
          return { success: true, message: 'Article deleted successfully' }
        } else {
          throw new Error(response.message || 'Failed to delete article')
        }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    setArticle(articleData) {
      this.currentArticle = articleData
    },

    setSearchQuery(query) {
      this.searchQuery = query
      this.updateFilteredArticles()
    },

    setSelectedCategory(category) {
      this.selectedCategory = category
      this.updateFilteredArticles()
    },

    setFilterModalOpen(isOpen) {
      this.filterModalOpen = isOpen
    },

    updateFilteredArticles() {
      this.filteredArticles = this.articles.filter(article => {
        const matchesSearch = article.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                              article.author?.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = !this.selectedCategory || article.category === this.selectedCategory
        return matchesSearch && matchesCategory
      })
    },

    /* async updateArticle(articleId, articleData) {
      // Implement API call to update an article
      console.log('Updating article:', articleId, articleData)
      // For now, just update it in the local state
      const index = this.articles.findIndex(article => article.id === articleId)
      if (index !== -1) {
        this.articles[index] = { ...this.articles[index], ...articleData }
        this.updateFilteredArticles()
      }
    }, */

    resetFilters() {
      this.searchQuery = ''
      this.selectedCategory = null
      this.updateFilteredArticles()
    }
  }
})