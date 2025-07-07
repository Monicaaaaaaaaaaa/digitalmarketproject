<template>
  <div class="vendor-card">
    <div class="vendor-image">
      <img :src="vendor.avatarUrl" :alt="vendor.name" />
      <div class="vendor-badge">{{ vendor.rating }}</div>
    </div>
    <div class="vendor-details">
      <h3>{{ vendor.name }}</h3>

      <div class="vendor-rating" v-if="typeof vendor.rating === 'number'">
        <i v-for="i in fullStars" :key="i" class="fas fa-star"></i>
        <i v-if="hasHalfStar" class="fas fa-star-half-alt"></i>
        <i v-for="i in emptyStars" :key="'e' + i" class="far fa-star"></i>
        <span>{{ vendor.rating }}</span>
      </div>

      <!-- <p>{{ vendor.description }}</p> -->
      <NuxtLink
        :to="`/vendors/profile?email=${vendor.email}`"
        class="btn-filled btn-profile"
      >
        View Profile
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Account, Vendor } from "~/utils/model";

  const { vendor } = defineProps<{
    vendor: Account;
  }>();

  const fullStars = Math.floor(vendor.rating);
  const hasHalfStar = vendor.rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
</script>
