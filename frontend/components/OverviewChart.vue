<template>
    <div class=" md:p-12 rounded-lg text-secondary">
    <div class="flex items-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m-4-4h8" />
      </svg>
      <h2 class="text-xl font-semibold">{{ $t('statisticsSection.eventPredition') }}</h2>
    </div>
    <AreaChart :data="predictedData" index="name" :categories="['total', 'predition']" :colors="['#FBB03B', '#F15A24']"/>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { AreaChart } from '@/components/ui/chart-area';
import { useEventStore } from '@/stores/eventStore'; 
const {t} = useI18n()

const eventStore = useEventStore();

// Computed para contar los eventos por mes
const monthlyEventCounts = computed(() => {
  const counts = {};
  eventStore.events.forEach(event => {
    const month = new Date(event.eventDate?.year, event.eventDate?.month - 1, event.eventDate?.day).toLocaleString('default', { month: 'short' });
    counts[month] = counts[month] ? counts[month] + 1 : 1;
  });
  return counts;
});

// Crear los datos pasados en función de los eventos
const pastData = computed(() => {
  return Object.entries(monthlyEventCounts.value).map(([month, count]) => ({
    name: month,
    total: count
  }));
});

// Función para predecir el siguiente mes
function predictNextMonth(data) {
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i + 1);
  const y = data.map((d) => d.total);

  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    denominator += (x[i] - xMean) ** 2;
  }

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Predicción para el siguiente mes
  const nextMonth = slope * (n + 1) + intercept;

  return Math.round(nextMonth);
}

// Computed para obtener los datos de predicción
const predictedData = computed(() => {
  const data = pastData.value;
  const predictedNextMonth = predictNextMonth(data);
  return [
    ...data,
    { name: 'Next Month', total: null, predicted: predictedNextMonth },
  ];
});
</script>