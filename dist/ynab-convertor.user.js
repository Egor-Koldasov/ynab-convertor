// ==UserScript==
// @name       ynab-convertor
// @namespace  npm/vite-plugin-monkey
// @version    1.0.0
// @author     monkey
// @icon       https://vitejs.dev/logo.svg
// @match      https://app.ynab.com/*
// @require    https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @grant      GM_addStyle
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .convertor[data-v-65c468d6]{display:flex}.convertor .rate-input[data-v-65c468d6]{width:64px;border:1px solid var(--action_primary);text-align:right}.convertor .rate-input[data-v-65c468d6]::-webkit-outer-spin-button,.convertor .rate-input[data-v-65c468d6]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.convertor .rate-input[type=number][data-v-65c468d6]{-webkit-appearance:textfield;-moz-appearance:textfield;appearance:textfield}.convertor .rate-applied[data-v-65c468d6]{margin-right:4px;width:16px}.convertor.invalid .rate-input[data-v-65c468d6]{border-color:#ff4545}.outflow-input[data-v-74f85be7]{text-align:right}.outflow-input[data-v-74f85be7]::-webkit-outer-spin-button,.outflow-input[data-v-74f85be7]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.outflow-input[type=number][data-v-74f85be7]{-webkit-appearance:textfield;-moz-appearance:textfield;appearance:textfield} ");

(function (vue) {
  'use strict';

  const storageKeys = {
    rate: "convertor_rate"
  };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "RateInputBox",
    setup(__props) {
      const rateString = vue.ref("");
      const rate = vue.computed(() => parseFloat(rateString.value));
      const isRateValid = vue.computed(() => !isNaN(rate.value) && rate.value > 0 && isFinite(rate.value));
      vue.onBeforeMount(() => {
        const storedRate = localStorage.getItem(storageKeys.rate);
        if (storedRate) {
          rateString.value = storedRate;
        }
      });
      vue.watchEffect(() => {
        if (isRateValid.value) {
          localStorage.setItem(storageKeys.rate, rate.value.toString());
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["convertor", { invalid: !isRateValid.value }])
        }, [
          vue.withDirectives(vue.createElementVNode("input", {
            type: "number",
            class: "rate-input",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => rateString.value = $event),
            onKeydown: _cache[1] || (_cache[1] = vue.withModifiers(() => {
            }, ["stop"]))
          }, null, 544), [
            [vue.vModelText, rateString.value]
          ])
        ], 2);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const RateInputBox = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-65c468d6"]]);
  const waitFor = (fn, interval = 100) => {
    return new Promise((resolve) => {
      const initInterval = () => {
        const fnReturn = fn();
        if (fnReturn)
          resolve(fnReturn);
        return !!fnReturn;
      };
      const intervalId = setInterval(() => {
        if (initInterval())
          clearInterval(intervalId);
      }, interval);
    });
  };
  const _hoisted_1 = { class: "outflow-rated" };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "OutflowRated",
    setup(__props) {
      const rate = vue.ref(null);
      const outflowRatedString = vue.ref("");
      const outflowRated = vue.computed(() => parseFloat(outflowRatedString.value));
      vue.onBeforeMount(() => {
        const storedRate = localStorage.getItem(storageKeys.rate);
        if (storedRate) {
          rate.value = parseFloat(storedRate);
        }
      });
      vue.watchEffect(() => {
        const outflowInput = document.querySelector(".ynab-new-currency-input.is-editing input.ember-text-field");
        if (!outflowInput)
          throw new Error("Unexpected: outflowInput not found");
        if (!outflowRated.value || isNaN(outflowRated.value) || !isFinite(outflowRated.value))
          return;
        if (!rate.value)
          return;
        const ratedLong = outflowRated.value / rate.value;
        const ratedRound = Math.round((ratedLong + Number.EPSILON) * 100) / 100;
        outflowInput.value = String(ratedRound);
        outflowInput.dispatchEvent(new Event("input", { bubbles: true, cancelable: true, composed: true }));
        outflowInput.dispatchEvent(new Event("change", { bubbles: true, cancelable: true, composed: true }));
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.withDirectives(vue.createElementVNode("input", {
            class: "outflow-input accounts-text-field",
            type: "number",
            placeholder: "rated outflow",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => outflowRatedString.value = $event),
            onKeydown: _cache[1] || (_cache[1] = vue.withModifiers(() => {
            }, ["stop"]))
          }, null, 544), [
            [vue.vModelText, outflowRatedString.value]
          ])
        ]);
      };
    }
  });
  const OutflowRatedVue = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-74f85be7"]]);
  console.log("ynab script loaded");
  const main = async () => {
    mountRateInputBox();
    mountOutflowRated();
  };
  const mountRateInputBox = async () => {
    const panel = await waitFor(() => document.querySelector(".accounts-header-balances"));
    const root = document.createElement("div");
    root.id = "currency-root";
    root.style.marginLeft = "auto";
    panel.appendChild(root);
    vue.createApp(RateInputBox).mount("#currency-root");
  };
  const mountOutflowRated = async () => {
    const memoCell = await waitFor(
      () => document.querySelector(
        ".ynab-grid-body-row.is-editing .ynab-grid-cell-outflow.user-data:not(.outflow-rated-added)"
      )
    );
    const root = document.createElement("div");
    root.id = "outflow-rated-root";
    root.className = "ynab-grid-cell js-ynab-grid-cell user-data";
    root.style.padding = "0";
    memoCell.appendChild(root);
    memoCell.classList.add("outflow-rated-added");
    vue.createApp(OutflowRatedVue).mount("#outflow-rated-root");
    await mountOutflowRated();
  };
  main();

})(Vue);