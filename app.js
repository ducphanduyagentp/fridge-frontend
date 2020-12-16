Vue.component('item-action', {
    props: ['id'],
    template: `<b-button-group size="sm">
    <b-button variant="warning" @click="alert(id)" class="mr-4"><b-icon icon="gear-fill"></b-icon> Edit</b-button>
    <b-button variant="danger"><b-icon icon="trash-fill"></b-icon> Remove</b-button>
    </b-button-group>`
})

var app = new Vue({
  el: '#app',
  data: {
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'item_name', label: 'Item Name' },
      { key: 'quantity_unit', label: 'Quantity' },
      { key: 'actions', label: 'Actions' }
    ],
    items: [
      { id: 1, item_name: "bruh1", quantity: 20, unit: "unit1" },
      { id: 2, item_name: "bruh2", quantity: 220, unit: "unit2" },
      { id: 3, item_name: "bruh3", quantity: 120, unit: "unit3" },
      { id: 3, item_name: "bruh3", quantity: 120, unit: "unit3" },
      { id: 3, item_name: "bruh3", quantity: 120, unit: "unit3" },
      { id: 3, item_name: "bruh3", quantity: 120, unit: "unit3" }
    ]
  }
})