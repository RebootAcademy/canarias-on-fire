// stores/articleStore.js
import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [],
    filteredArticles: [],
    searchQuery: '',
    selectedCategory: null,
    filterModalOpen: false,
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchArticles() {
      this.isLoading = true
      this.error = null
      try {
        const data = await $fetch('http://localhost:8080/api/articles')
        this.articles = data.result || []
      } catch (error) {
        this.error = error
      } finally {
        this.isLoading = false
      }
    },

    async fetchArticleById(articleId) {
      try {
        const data = await $fetch(`http://localhost:8080/api/articles/${articleId}`)
        if (data && data.result) {
          this.setArticle(data.result)
          return data.result
        }
        throw new Error('Article not found')
      } catch (error) {
        throw error
      }
    },

    setArticle(articleData) {
      this.article = articleData
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
        const matchesSearch = article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                              article.author.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = !this.selectedCategory || article.category === this.selectedCategory
        return matchesSearch && matchesCategory
      })
    },

/*     async createArticle(articleData) {
      // Implement API call to create a new article
      console.log('Creating article:', articleData)
      // For now, just add it to the local state
      const newArticle = {
        id: this.articles.length + 1,
        ...articleData
      }
      this.articles.push(newArticle)
      this.updateFilteredArticles()
    },

    async updateArticle(articleId, articleData) {
      // Implement API call to update an article
      console.log('Updating article:', articleId, articleData)
      // For now, just update it in the local state
      const index = this.articles.findIndex(article => article.id === articleId)
      if (index !== -1) {
        this.articles[index] = { ...this.articles[index], ...articleData }
        this.updateFilteredArticles()
      }
    },

    async deleteArticle(articleId) {
      // Implement API call to delete an article
      console.log('Deleting article:', articleId)
      // For now, just remove it from the local state
      this.articles = this.articles.filter(article => article.id !== articleId)
      this.updateFilteredArticles()
    }, */

    resetFilters() {
      this.searchQuery = ''
      this.selectedCategory = null
      this.updateFilteredArticles()
    }
  }
})