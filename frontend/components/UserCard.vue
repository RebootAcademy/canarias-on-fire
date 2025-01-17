<template>
<div class="flex flex-col gap-2 border text-secondary border-whiteGray rounded p-4 xs:h-[170px] sm:h-[170px] xl:h-[170px] w-full" >
    <div class="flex justify-between gap-2">
        <p class="text-whiteGray text-2xl font-bold"> {{user.commercialName || user.bandName }}</p>
        <p class="text-secondary italic text-sm">{{ user.serviceType}}</p>
    </div>
    <div class="flex flex-col gap-3">
        <div v-if="user.role !== 'musician' && user.preferredLocations" class="flex flex-row gap-2 items-center text-secondary italic">
            <MapPin  size="20" />
            <p>{{ user.preferredLocations[0] }}</p>
        </div>
        <div v-else class="flex flex-row gap-2 items-center text-secondary italic">
            <Music  size="20" />
            {{ user.genre }}
        </div>
        <div class="flex flex-row gap-2 items-center text-secondary italic">
            <Phone size="20" />
            <p>{{ user.phone }}</p>
        </div>
        <div v-if="props.user.socialMedia?.instagram" class="flex flex-row gap-2 items-center text-secondary">
            <Instagram size="20"/>
            <a :href="`https://www.instagram.com/${user.socialMedia.instagram}`" target="_blank" rel="noopener noreferrer" class="hover:text-primary">
                @{{ user?.socialMedia?.instagram }}
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
    <!-- <div class="flex flex-row gap-2 items-center text-white italic">
            <ChefHat size="20" />
            <p>{{ user.foodType }}</p>
        </div> -->
    <!-- <div v-if="band.nextPerformance && isValidNextPerformance(band.nextPerformance)">
        <p class="text-whiteGray mt-4">{{ $t('bandNextPerformance')}}</p>
        <div class="flex flex-col gap-3 mt-2">
            <div class="flex flex-row gap-2 items-center">
                <Calendar size="20"/>
                <p>{{ formattedDate(band.nextPerformance.date) }} - {{ band.nextPerformance.startTime }}</p>
            </div>
            <div class="flex flex-row gap-2 items-center">
                <MapPin  size="20" />
                <p>{{ band.nextPerformance.location.address}} </p>
            </div>
        </div>
    </div> -->
    <!-- <div v-else>
        <p class="text-whiteGray mt-4">No hay proxima actuación publicada</p>
    </div> -->
</div>
</template>
    
<script setup>
import { 
    ArrowLeft, 
    Instagram, 
    Facebook, 
    Youtube, 
    AtSign, 
    MapPin, 
    Calendar,
    Phone,
    ChefHat,
    Truck,
    Music
} from 'lucide-vue-next'


const props = defineProps({
  user: {
    type: Object,
    required: true
  },
})

// const isValidNextPerformance = (nextPerformance) => {
//   return (
//     typeof nextPerformance.date === 'object' && nextPerformance.date !== null ||
//     typeof nextPerformance.location === 'object' && nextPerformance.location !== null
//   )
// }
</script>
