import StoreRegistry from '../store-registry';

describe('Store Registry', () => {
  it('Should return null when no store is set', async () => {
    expect(StoreRegistry.getStore()).toEqual(null);
  });

  it('Should return the store when the store is set', async () => {
    const store = 3;
    StoreRegistry.setStore(store);
    expect(StoreRegistry.getStore()).toEqual(store);
  });
});
