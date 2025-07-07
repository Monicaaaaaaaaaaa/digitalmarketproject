<script setup lang="ts">
  const vendorsStore = useVendorsStore();
  const { categoryOptions, vendors, filteredVendors, selectedCategory } =
    storeToRefs(vendorsStore);

  onMounted(() => {
    vendorsStore.loadSystemVendors();
  });
</script>

<template>
  <section class="vendors" id="vendors">
    <div class="container">
      <div class="section-header">
        <h2>Our Vendors</h2>
        <p>Discover businesses around campus</p>
      </div>

      <VendorFilter v-model="selectedCategory" :categories="categoryOptions" />

      <div class="vendors-grid">
        <VendorCard
          v-for="vendor in filteredVendors"
          :key="vendor.email"
          :vendor="vendor"
        />
        <div class="more-vendors">
          <NuxtLink to="/vendors" class="btn-primary"
            >View All Vendors</NuxtLink
          >
        </div>
      </div>
    </div>
  </section>
</template>
