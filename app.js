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
    },
    updating: false,
    current_id: -1
  },
  methods: {
    getItems() {
      const path = "http://192.168.0.102:5000/getItems";
      axios.get(path)
        .then((res) => {
          this.items = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addItem(payload) {
      const path = "http://192.168.0.102:5000/addItem";
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
      this.updating = true;
      this.editItemForm(item);
      this.$refs.addItemModal.show();
    },
    editItemReal(payload) {
      const path = "http://192.168.0.102:5000/editItem";
      axios.post(path, payload)
        .then((res) => {
          this.getItems();
        })
        .catch((error) => {
          console.log(error);
          this.getItems();
        });
      this.updating = false;
    },
    removeItem(item) {
      const path = "http://192.168.0.102:5000/removeItem";
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
      this.current_id = -1;
    },
    editItemForm(item) {
      this.addItemForm.item_name = item.item_name;
      this.addItemForm.quantity = item.quantity;
      this.addItemForm.unit = item.unit;
      this.current_id = item.id;
    },
    submitAddItem: function(evt) {
      evt.preventDefault();
      var payload = {
        item_name: this.addItemForm.item_name,
        quantity: this.addItemForm.quantity,
        unit: this.addItemForm.unit,
        id: this.current_id
      };
      if (!this.updating) {
        this.addItem(payload);
      } else {
        this.editItemReal(payload);
      }
      this.$refs.addItemModal.hide();
      this.initItemForm();
    },
    resetAddItem: function(evt) {
      evt.preventDefault();
      this.$refs.addItemModal.hide();
      this.initItemForm();
    },
    resetButton: function() {
      this.updating = false;
      this.current_id = -1;
      this.initItemForm();
    }
  },
  created: function () {
    this.getItems();
  }
})