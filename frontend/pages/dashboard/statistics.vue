<template>
  <div class="p-6">
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Revenue" value="$45,231.89" change="+20.1%" icon="dollar-sign" />
      <StatCard title="Subscriptions" value="2350" change="+180.1%" icon="users" />
      <StatCard title="Sales" value="12,234" change="+19%" icon="shopping-cart" />
      <StatCard title="Active Now" value="573" change="+201" icon="activity" />
    </div>
    
    <div class="p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Overview</h2>
      <OverviewChart />
    </div>
  </div>
</template>

<script setup>


definePageMeta({
  layout: 'dashboard'
})
</script>