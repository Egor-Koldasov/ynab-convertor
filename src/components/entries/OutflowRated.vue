<script setup lang="ts">
import { ref, onBeforeMount, watchEffect, computed } from 'vue';
import { storageKeys } from '../../util/vars/storageKeys';

  const rate = ref<number | null>(null);
  const outflowRatedString = ref<string>('');
  const outflowRated = computed(() => parseFloat(outflowRatedString.value));

  onBeforeMount(() => {
    const storedRate = localStorage.getItem(storageKeys.rate);
    if (storedRate) {
      rate.value = parseFloat(storedRate);
    }
  });

  watchEffect(() => {
    const outflowInput = document.querySelector<HTMLInputElement>('.ynab-new-currency-input.is-editing input.ember-text-field')
    if (!outflowInput) throw new Error('Unexpected: outflowInput not found')
    if (!outflowRated.value || isNaN(outflowRated.value) || !isFinite(outflowRated.value)) return;
    if (!rate.value) return;

    const ratedLong = outflowRated.value / rate.value
    const ratedRound = Math.round((ratedLong + Number.EPSILON) * 100) / 100
    outflowInput.value = String(ratedRound);

    outflowInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
    outflowInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true, composed: true }));
  })
</script>

<template>
  <div class="outflow-rated">
    <input class="outflow-input accounts-text-field" type="number" placeholder="rated outflow" v-model="outflowRatedString" @keydown.stop />
  </div>
</template>

<style scoped lang="scss">
  .outflow-input {
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
</style>
