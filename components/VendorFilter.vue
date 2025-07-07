<template>
  <div class="vendor-filters">
    <button
      v-for="option in categories"
      :key="option"
      class="filter-btn"
      :class="{ active: modelValue === option }"
      @click="$emit('update:modelValue', option)"
    >
      {{ option === "all" ? "All" : option }}
    </button>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    modelValue: string;
    categories: string[];
  }>();
  defineEmits(["update:modelValue"]);
</script>
