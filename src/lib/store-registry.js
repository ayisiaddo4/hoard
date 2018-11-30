class StoreRegistry {
  store = null;
  getStore = () => this.store;
  setStore = store => (this.store = store);
}

export default new StoreRegistry();
