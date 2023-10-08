<script setup lang="ts">
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { RateMethod } from '../../types/RateMethod';
import { RateStorage } from '../../util/RateStorage';
import { isRateValid } from '../../util/isRateValid';

  const rateString = ref("");
  const rateMethod = ref<RateMethod>(RateMethod.multiply);

  const rate = computed(() => parseFloat(rateString.value));

  const rateMethodChar = computed(() => rateMethod.value === RateMethod.multiply ? '×' : '÷')

  const toggleRateMethod = () => {
    rateMethod.value = rateMethod.value === RateMethod.multiply ? RateMethod.divide : RateMethod.multiply;
  }

  onBeforeMount(() => {
    const state = RateStorage.get();
    rateString.value = state.rate.toString();
    rateMethod.value = state.method;
  });

  watchEffect(() => {
    if (isRateValid(rate.value)) {
      RateStorage.set({
        rate: rate.value,
        method: rateMethod.value
      })
    }
  })

</script>

<template>
  <div class="convertor" :class="{invalid: !isRateValid}">
    <div class="input-group">
      <button type="button" class="rate-method button button-primary" @click="toggleRateMethod">{{ rateMethodChar }}</button>
      <input type="number" name="convertation-rate" class="rate-input accounts-text-field" v-model="rateString" @keydown.stop />
    </div>
    <div class="accounts-header-label">Outflow = amount {{ rateMethodChar }} rate</div>
  </div>
</template>

<style scoped lang="scss">
.convertor {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .input-group {
    display: flex;
    gap: 8px;
  }
  .rate-method {
    font-size: 20px;
    width: 24px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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

<style lang="scss">
.ynab-grid-body-row.is-editing .ynab-grid-cell {
  vertical-align: bottom;
}
</style>

../../util/vars/StorageKey