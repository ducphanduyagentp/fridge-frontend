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
    addReceipeForm: {
      receipe_name: '',
      cooking_time: 0,
      ingredients: ''
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
    addReceipe(payload) {
      const path = "http://192.168.0.102:5000/addReceipe";
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
    editReceipe(receipe) {
      this.updating = true;
      this.editReceipeForm(receipe);
      this.$refs.addReceipeModal.show();
    },
    editReceipeReal(payload) {
      const path = "http://192.168.0.102:5000/editReceipe";
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
    removeReceipe(receipe) {
      const path = "http://192.168.0.102:5000/removeReceipe";
      const payload = {
        id: receipe.id
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
    initReceipeForm() {
      this.addReceipeForm.receipe_name = '';
      this.addReceipeForm.cooking_time = 0;
      this.addReceipeForm.ingredients = '';
      this.current_id = -1;
    },
    editReceipeForm(receipe) {
      this.addReceipeForm.receipe_name = receipe.receipe_name;
      this.addReceipeForm.cooking_time = receipe.cooking_time;
      this.addReceipeForm.ingredients = receipe.ingredients.join(', ');
      this.current_id = receipe.id;
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
    submitAddReceipe: function(evt) {
      evt.preventDefault();
      var ingredients_array = this.addReceipeForm.ingredients.split(',');
      for (var i = 0; i < ingredients_array.length; i++) {
        ingredients_array[i] = ingredients_array[i].trim();
      }
      var payload = {
        receipe_name: this.addReceipeForm.receipe_name,
        cooking_time: this.addReceipeForm.cooking_time,
        ingredients: ingredients_array,
        id: this.current_id
      };
      if (!this.updating) {
        this.addReceipe(payload);
      } else {
        this.editReceipeReal(payload);
      }
      this.$refs.addReceipeModal.hide();
      this.initReceipeForm();
    },
    resetAddReceipe: function(evt) {
      evt.preventDefault();
      this.$refs.addReceipeModal.hide();
      this.initReceipeForm();
    },
    resetButton: function() {
      this.updating = false;
      this.current_id = -1;
      this.initItemForm();
      this.initReceipeForm();
    }
  },
  created: function () {
    this.getItems();
    this.getReceipes();
  }
})