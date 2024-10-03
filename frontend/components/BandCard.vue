<template>
<div class="flex flex-col gap-2 border border-whiteGray w-full rounded p-4 h-auto xs:min-h-[250px] sm:min-h-[270px] xl:min-h-[270px]" >
    <div class="flex justify-between">
        <p class="text-whiteGray text-2xl font-bold"> {{band.bandName }}</p>
        <p class="text-secondary italic text-sm">{{ band.genre }}</p>
    </div>
    <div class="flex flex-col gap-3">
        <div class="flex flex-row gap-2 items-center text-secondary italic">
            <AtSign size="20"/>
            <p>{{ band.email }}</p>
        </div>
        <div v-if="props.band.socialMedia.instagram" class="flex flex-row gap-2 items-center text-secondary">
            <Instagram size="20"/>
            <a :href="`https://www.instagram.com/${band.socialMedia.instagram}`" target="_blank" rel="noopener noreferrer" class="hover:text-primary">
                @{{ band?.socialMedia.instagram }}
            </a>    
        </div>
       <!--  <div v-if="props.band.socialMedia.facebook" class="flex flex-row gap-2 items-center text-white">
            <Facebook size="20"/>
            <a :href="`https://www.facebook.com/${band.socialMedia.facebook}`" target="_blank" rel="noopener noreferrer" class="hover:text-primary">
                {{ band?.socialMedia.facebook }}
            </a>    
        </div>
        <div v-if="props.band.socialMedia.youtube" class="flex flex-row gap-2 items-center text-white">
            <Youtube size="20"/>
            <a :href="`https://www.youtube.com/user/${band.socialMedia.youtube}`" target="_blank" rel="noopener noreferrer" class="hover:text-primary">
                @{{ band?.socialMedia.youtube }}
            </a>    
        </div> -->
    </div>
    <div v-if="band.nextPerformance && isValidNextPerformance(band.nextPerformance)">
        <p class="text-whiteGray mt-4">{{ $t('bandNextPerformance')}}</p>
        <div class="flex flex-col gap-3 mt-2">
            <div class="flex flex-row gap-2 items-center">
                <Calendar size="20"/>
                <p>{{ formattedDate(band.nextPerformance.date) }} - {{ band.nextPerformance.startTime }}</p>
            </div>
            <div class="flex flex-row gap-2 items-center">
                <MapPin  size="20" />
                <p class="text-xs lg:text-base">{{ band.nextPerformance.location.address}} </p>
            </div>
        </div>
    </div>
    <div v-else>
        <p class="text-whiteGray mt-4">No hay proxima actuación publicada</p>
    </div>
</div>
</template>
    
<script setup>
import { ArrowLeft, Instagram, Facebook, Youtube, AtSign, MapPin, Calendar} from 'lucide-vue-next'


const props = defineProps({
  band: Object,
  required: true
})

const isValidNextPerformance = (nextPerformance) => {
  return (
    typeof nextPerformance.date === 'object' && nextPerformance.date !== null ||
    typeof nextPerformance.location === 'object' && nextPerformance.location !== null
  )
}
</script>
