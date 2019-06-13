var app = new Vue({
    el: '#admin',
    data: {
        title: "",
        description: "",
        selected:  "",
        addItem: null,
        items: [],
        findTitle: "",
        findItem: null,
    },
    created() {
        this.getItems();
    },
    methods: {
        async addNewItem(){
            try {
                let result = await axios.post('/api/items', {
                    title: this.title,
                    description: this.description,
                });
                this.addItem = result.data;
            } catch (error) {
                console.log(error);
            }
        },
        async getItems() {
            try {
                let response = await axios.get("/api/items");
                this.items = response.data;
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        selectItem(item) {
            this.findTitle = "";
            this.findItem = item;
        },
        async deleteItem(item) {
            try {
                let response = await axios.delete("/api/items/" + item.id);
                this.findItem = null;
                this.getItems();
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        async editItem(item) {
            try {
                let response = await axios.put("/api/items/" + item.id, {
                    title: this.findItem.title, description: this.findItem.description,
                });
                this.findItem = null;
                this.getItems();
                return true;
            } catch (error) {
                console.log(error);
            }
        },
    },
    computed: {
        suggestions() {
            return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
        }
    },

});
