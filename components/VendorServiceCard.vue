<template>
  <div class="service-card">
    <img :src="service.imageUrl" :alt="service.name" class="service-image" />

    <div class="service-info">
      <h3 class="service-name">{{ service.name }}</h3>
      <p class="service-price">₦{{ service.price.toLocaleString() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Account, Vendor } from "~/utils/model";

  const { service } = defineProps<{
    service: VendorService;
  }>();
</script>

<style scoped>
  .service-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .service-card:hover {
    transform: translateY(-4px);
  }

  .service-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }

  .service-info {
    padding: 1rem;
    flex-grow: 1;
  }

  .service-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .service-price {
    font-size: 1rem;
    color: #4285f4;
    font-weight: 500;
  }

  .btn-book {
    margin: 0 1rem 1rem;
    padding: 0.6rem;
    background: #4285f4;
    color: white;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-book:hover {
    background: #092d67;
  }
</style>
