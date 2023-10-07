<script setup lang="ts">
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { storageKeys } from '../../util/vars/storageKeys';

  const rateString = ref("");
  const rate = computed(() => parseFloat(rateString.value));
  const isRateValid = computed(() => !isNaN(rate.value) && rate.value > 0 && isFinite(rate.value));

  onBeforeMount(() => {
    const storedRate = localStorage.getItem(storageKeys.rate);
    if (storedRate) {
      rateString.value = storedRate;
    }
  });

  watchEffect(() => {
    if (isRateValid.value) {
      localStorage.setItem(storageKeys.rate, rate.value.toString());
    }
  })

</script>

<template>
  <div class="convertor" :class="{invalid: !isRateValid}">
    <!-- <input type="checkbox" class="rate-applied" v-model="rateApplied" /> -->
    <input type="number" class="rate-input" v-model="rateString" @keydown.stop />
  </div>
</template>

<style scoped lang="scss">
.convertor {
  display: flex;
  .rate-input {
    width: 64px;
    border: 1px solid var(--action_primary);
    text-align: right;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type=number] {
      appearance: textfield;
    }
  }
  .rate-applied {
    margin-right: 4px;
    width: 16px;
  }
  &.invalid {
    .rate-input {
      border-color: #ff4545;
    }
  }
}
</style>
