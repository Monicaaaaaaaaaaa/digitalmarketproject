<template>
  <div class="bg-surface">
    <NavBar />
    <slot />
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  const { isAuthenticated } = useAppSession();
  const accountStore = useAccountStore();

  /// Watch for when user logs in
  watch(isAuthenticated, () => {
    accountStore.fetchAccount();
  });

  /// Fetch account details when site is loaded
  onMounted(() => {
    if (isAuthenticated) {
      accountStore.fetchAccount();
    }
  });
</script>
