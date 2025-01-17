<template>
    <div class="mt-8">
    <p class="text-xl font-semibold">{{ $t('paymentsSection.paymentHistory') }}</p>
    <p class="text-grayForeground mt-4">{{ $t('paymentsSection.paymentDetails') }}</p>
    <div v-if="formattedInvoices?.length" class="container mx-auto p-4">
      <table class="table-auto w-full">
        <thead>
          <tr class="text-grayForeground border-b-2 border-gray">
            <th class="text-start p-2">{{ $t('paymentsSection.paymentDate') }}</th>
            <th class="text-start p-2">{{ $t('paymentsSection.paymentAmount') }}</th>
            <th class="text-start p-2">{{ $t('paymentsSection.paymentInvoice') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(invoice, index) in formattedInvoices"
            :key="index"
            class="p-2 border-b border-gray"
          >
            <td class="p-2">
              {{ invoice?.formattedDate }}
            </td>
            <td class="p-2">
              {{ invoice?.formattedAmount }} €
            </td>
            <td class="p-2">
              <a
                :href="invoice?.pdf"
                class="text-blue-600 underline"
                target="_blank"
                >{{ $t('buttons.download') }} {{ $t('paymentsSection.paymentInvoice') }}</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!formattedInvoices">{{ $t('paymentsSection.noInvoices') }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  formattedInvoices: {
    type: Array,
    required: true
  }
})
</script>

