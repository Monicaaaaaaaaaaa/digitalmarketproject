<script lang="ts" setup>
  const vendorStore = useVendorsStore();
  const { searchQuery } = storeToRefs(vendorStore);
</script>
<template>
  <div>
    <section class="vendor-hero">
      <div class="container">
        <div class="vendor-hero-content">
          <h2><span>Discover</span> CampusVendors</h2>
          <p>
            Connect with trusted beauty professionals, businesses, and student
            entrepreneurs.
          </p>
          <form id="searchForm">
            <input
              type="text"
              v-model="searchQuery"
              id="searchInput"
              placeholder="Search vendors..."
              required
            />
            <button type="submit" class="search-button">Search</button>
          </form>
          <div id="vendorResults"></div>
        </div>
      </div>
    </section>

    <section class="vendors" id="vendors">
      <VendorSection />
    </section>
  </div>
</template>

<style></style>
