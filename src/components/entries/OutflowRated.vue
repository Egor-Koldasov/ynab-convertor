<script setup lang="ts">
import { ref, onBeforeMount, watchEffect, computed } from 'vue';
import debounce from "debounce";
import { RateStorage } from '../../util/RateStorage';
import { RateMethod } from '../../types/RateMethod';
import { RateStorageState } from '../../types/RateStorageState';

  const rate = ref<number | null>(null);
  const rateMethod = ref<RateMethod>(RateMethod.multiply);
  const unsubscribe = ref<() => void>(() => {});
  const outflowRatedString = ref<string>('');

  const syncWithStorage = (state: RateStorageState) => {
    rate.value = state.rate;
    rateMethod.value = state.method;
  }

  const outflowRated = computed(() => parseFloat(outflowRatedString.value));
  const fixOutflowInput = debounce((outflowInput: HTMLInputElement) => {
    const currentFocus = document.activeElement;
    outflowInput.focus();
    window.requestAnimationFrame(() => {
      if (currentFocus) {
        (currentFocus as HTMLElement).focus();
      }
    })
  }, 10)

  onBeforeMount(() => {
    const state = RateStorage.get();
    syncWithStorage(state)
    unsubscribe.value = RateStorage.subscribe(syncWithStorage)
  });

  watchEffect(() => {
    const outflowInput = document.querySelector<HTMLInputElement>('.ynab-new-currency-input.is-editing input.ember-text-field')
    if (!outflowInput) throw new Error('Unexpected: outflowInput not found')
    if (!outflowRated.value || isNaN(outflowRated.value) || !isFinite(outflowRated.value)) return;
    if (!rate.value) return;

    const ratedLong = rateMethod.value === RateMethod.multiply ? outflowRated.value * rate.value : outflowRated.value / rate.value
    const ratedRound = Math.round((ratedLong + Number.EPSILON) * 100) / 100
    outflowInput.value = String(ratedRound);

    // Reverse-ingeniered fix, without it the outflow input will reset
    outflowInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
    outflowInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true, composed: true }));
    fixOutflowInput(outflowInput)
  })
</script>

<template>
  <div class="outflow-rated">
    <input class="outflow-input accounts-text-field" type="number" placeholder="orig outflow" v-model="outflowRatedString" @keydown.stop />
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
