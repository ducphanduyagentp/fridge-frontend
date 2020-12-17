Vue.component('item-action', {
    props: ['item'],
    template: `<b-button-group size="sm">
    <b-button variant="warning" @click="editItem(item)" class="mr-4"><b-icon icon="gear-fill"></b-icon> Edit</b-button>
    <b-button variant="danger" @click="removeItem(item)"><b-icon icon="trash-fill"></b-icon> Remove</b-button>
    </b-button-group>`,
    methods: {
      editItem: function(item) {
        this.$root.editItem(item);
      },
      removeItem: function(item) {
        this.$root.removeItem(item);
      }
    }
});

var app = new Vue({
  el: '#app',
  data: {
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'item_name', label: 'Item Name' },
      { key: 'quantity_unit', label: 'Quantity' },
      { key: 'actions', label: 'Actions' }
    ],
    items: [],
    addItemForm: {
      item_name: '',
      quantity: 0,
      unit: ''
    }
  },
  methods: {
    getItems() {
      const path = "http://localhost:5000/getItems";
      axios.get(path)
        .then((res) => {
          this.items = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addItem(payload) {
      const path = "http://localhost:5000/addItem";
      axios.post(path, payload)
        .then((res) => {
          this.getItems();
        })
        .catch((error) => {
          console.log(error);
          this.getItems();
        });
    },
    editItem(item) {
      alert("Editing " + item.item_name);
    },
    removeItem(item) {
      const path = "http://localhost:5000/removeItem";
      const payload = {
        id: item.id
      }
      axios.post(path, payload)
        .then((res) => {
          this.getItems();
        })
        .catch((error) => {
          console.log(error);
          this.getItems();
        });
    },
    initItemForm() {
      this.addItemForm.item_name = '';
      this.addItemForm.quantity = 0;
      this.addItemForm.unit = '';
    },
    submitAddBook: function(evt) {
      evt.preventDefault();
      this.$refs.addItemModal.hide();
      const payload = {
        item_name: this.addItemForm.item_name,
        quantity: this.addItemForm.quantity,
        unit: this.addItemForm.unit
      };
      this.addItem(payload);
      this.initItemForm();
    },
    resetAddBook: function(evt) {
      evt.preventDefault();
      this.$refs.addItemModal.hide();
      this.initItemForm();
    }
  },
  created: function () {
    this.getItems();
  }
})