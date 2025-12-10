// frontend/stores/cart.js
import { defineStore, skipHydrate } from 'pinia';
import { useToastStore } from './toast';

export const useCartStore = defineStore('cart', () => {
  
  const items = ref([]);
  const toastStore = useToastStore();
  
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  });

  
  const addItem = (product, quantity = 1) => {
    const existingItem = items.value.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity + quantity <= product.stock) {
        existingItem.quantity += quantity;
        toastStore.show('Cantidad actualizada en el carrito', 'success');
      } else {
        toastStore.show(`Solo hay ${product.stock} unidades disponibles`, 'warning');
      }
    } else {
      if (quantity <= product.stock) {
        items.value.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0]?.image_url || null,
          stock: product.stock,
          seller_id: product.seller_id,
          quantity
        });
        toastStore.show('Producto agregado al carrito', 'success');
      } else {
        toastStore.show('Stock insuficiente', 'error');
      }
    }
  };

  const removeItem = (productId) => {
    items.value = items.value.filter(item => item.id !== productId);
    toastStore.show('Producto eliminado del carrito', 'info');
  };

  const updateQuantity = (productId, newQuantity) => {
    const item = items.value.find(item => item.id === productId);
    if (item) {
      if (newQuantity > 0 && newQuantity <= item.stock) {
        item.quantity = newQuantity;
      } else if (newQuantity > item.stock) {
        toastStore.show(`Máximo ${item.stock} unidades`, 'warning');
        item.quantity = item.stock;
      }
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  
  if (process.client) {
    const savedCart = localStorage.getItem('marketplace_cart');
    if (savedCart) {
      items.value = JSON.parse(savedCart);
    }

    watch(items, (newItems) => {
      localStorage.setItem('marketplace_cart', JSON.stringify(newItems));
    }, { deep: true });
  }

  return {
    items: skipHydrate(items),
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
});