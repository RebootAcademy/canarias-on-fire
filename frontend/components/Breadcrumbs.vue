<template>
    <div class="w-full flex flex-row gap-1">
        <div v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="flex flex-row items-center font-bold gap-1 mb-4 xs:text-xl md:text-4xl">
            <span 
                @click="navigateTo(breadcrumb.path)" 
                class="cursor-pointer"
                :class="{ 'text-primary': route.path === breadcrumb.path }"
            >
                {{ breadcrumb.translatedName }}
            </span>
            <div v-if="index !== breadcrumbs.length - 1">
                <ChevronRight class="mx-1 w-4 h-4 xs:w-6 xs:h-6 md:w-8 md:h-10 lg:w-8 lg:h-10"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next'
const route = useRoute()
const router = useRouter()
const { t, locale} = useI18n()

let breadcrumbs = ref([]) 
const generateBreadcrumbs = () => {
    const pathArray = route.path.split('/').filter(item => item !== '')

    const dynamicBreadcrumbs = pathArray.map((item, index) => {
        return {
            name: item.charAt(0).toUpperCase() + item.slice(1), 
            translatedName: t(`dashboardNav.${item.toLowerCase()}`), 
            path: '/' + pathArray.slice(0, index + 1).join('/')
        }
    })
    breadcrumbs.value = [{ name: 'Home', path: '/', translatedName: t(`dashboardNav.home`) }].concat(dynamicBreadcrumbs)
}

generateBreadcrumbs()

watch(
  () => route.path, // Observa explícitamente el cambio en el path
  (newPath) => {
    generateBreadcrumbs(newPath)
  },
  { immediate: true } // Ejecutar inmediatamente para la primera carga
)

watch(
  () => locale.value, // Observa explícitamente el cambio de idioma
  () => {
    generateBreadcrumbs() // Regenera los breadcrumbs con las nuevas traducciones
  }
)

const navigateTo = (pathname) => {
    if (route.path !== pathname) {
        router.push(pathname)
    }
}

</script>