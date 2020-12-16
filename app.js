Vue.component('item-action', {
    props: ['item'],
    template: `<b-button-group size="sm">
    <b-button variant="warning" @click="editItem(item)" class="mr-4"><b-icon icon="gear-fill"></b-icon> Edit</b-button>
    <b-button variant="danger" @click="removeItem(item)"><b-icon icon="trash-fill"></b-icon> Remove</b-button>
    </b-button-group>`,
    methods: {
      editItem: function (item) {
        alert("Editing " + item.item_name);
      },
  
      removeItem: function (item) {
        alert("Removing " + item.item_name);
      }
    }
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
    items: []
  },
  methods: {
    getItems() {
      const path = "http://localhost:5000/getItems"
      axios.get(path)
        .then((res) => {
          this.items = res.data;
        })
        .catch((error) => {
          console.log(error);
        })
    }
  },
  created: function () {
    this.getItems();
  }
})