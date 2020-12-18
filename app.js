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

Vue.component('receipe-action', {
  props: ['receipe'],
  template: `<b-button-group size="sm">
  <b-button variant="warning" @click="editReceipe(receipe)" class="mr-4"><b-icon icon="gear-fill"></b-icon> Edit</b-button>
  <b-button variant="danger" @click="removeReceipe(receipe)"><b-icon icon="trash-fill"></b-icon> Remove</b-button>
  </b-button-group>`,
  methods: {
    editReceipe: function(receipe) {
      this.$root.editReceipe(receipe);
    },
    removeReceipe: function(receipe) {
      this.$root.removeReceipe(receipe);
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
    receipe_fields: [
      { key: 'id', label: 'ID' },
      { key: 'receipe_name', label: 'Receipe Name' },
      { key: 'cooking_time', label: 'Cooking Time' },
      { key: 'ingredients', label: 'Ingredients' },
      { key: 'actions', label: 'Actions' }
    ],
    items: [],
    addItemForm: {
      item_name: '',
      quantity: 0,
      unit: ''
    },
    updating: false,
    current_id: -1,
    receipes: []
  },
  methods: {
    hasItem(item_name) {
      for (var item of this.items) {
        if (item_name === item.item_name) {
          return true;
        }
      }
      return false;
    },
    cookable(receipe) {
      for (var ingredient of receipe.ingredients) {
        if (!this.hasItem(ingredient)) {
          return false;
        }
      }
      receipe._rowVariant = 'success';
      return true;
    },
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
    getReceipes() {
      const path = "http://192.168.0.102:5000/getReceipes";
      axios.get(path)
        .then((res) => {
          this.receipes = res.data;
          for (var receipe of this.receipes) {
            this.cookable(receipe);
          }
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
          this.getReceipes();
        })
        .catch((error) => {
          console.log(error);
          this.getItems();
          this.getReceipes();
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
          this.getReceipes();
        })
        .catch((error) => {
          console.log(error);
          this.getItems();
          this.getReceipes();
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
          this.getReceipes();
        })
        .catch((error) => {
          console.log(error);
          this.getItems();
          this.getReceipes();
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
    this.getReceipes();
  }
})