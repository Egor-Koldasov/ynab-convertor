import { createApp } from 'vue'
import RateInputBox from './components/entries/RateInputBox.vue'
import { waitFor } from './util/waitFor'
import OutflowRatedVue from './components/entries/OutflowRated.vue'

console.log('ynab script loaded')

const main = async () => {
  mountRateInputBox()
  mountOutflowRated()
}

const mountRateInputBox = async () => {
  const panel = await waitFor(() => document.querySelector('.accounts-header-balances'))
  const root = document.createElement('div')
  root.id = 'currency-root'
  root.style.marginLeft = 'auto'
  panel.appendChild(root)

  createApp(RateInputBox).mount('#currency-root')
}

const mountOutflowRated = async () => {
  const memoCell: Element = await waitFor(() =>
    document.querySelector(
      '.ynab-grid-body-row.is-editing .ynab-grid-cell-outflow.user-data:not(.outflow-rated-added)'
    )
  )
  const root = document.createElement('div')
  root.id = 'outflow-rated-root'
  root.className = 'ynab-grid-cell js-ynab-grid-cell user-data'
  // root.style.maxWidth = '100px'
  root.style.padding = '0'
  root.style.paddingTop = '2px'
  memoCell.appendChild(root)
  memoCell.classList.add('outflow-rated-added')

  createApp(OutflowRatedVue).mount('#outflow-rated-root')
  await mountOutflowRated()
}

main()
