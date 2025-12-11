import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../config/api_client.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<CartProvider>(
      builder: (context, cart, child) {
        return Scaffold(
          appBar: AppBar(
            title: Text('Mi Carrito (${cart.itemCount})'),
            actions: [
              if (cart.items.isNotEmpty)
                IconButton(
                  icon: const Icon(Icons.delete_outline),
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('¿Vaciar carrito?'),
                        content: const Text('Se eliminarán todos los productos.'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx),
                            child: const Text('CANCELAR'),
                          ),
                          TextButton(
                            onPressed: () {
                              cart.clear();
                              Navigator.pop(ctx);
                            },
                            child: const Text('VACIAR'),
                          ),
                        ],
                      ),
                    );
                  },
                ),
            ],
          ),
          body: cart.items.isEmpty
              ? _buildEmptyState()
              : Column(
                  children: [
                    Expanded(
                      child: ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: cart.items.length,
                        separatorBuilder: (_, __) => const Divider(),
                        itemBuilder: (context, index) {
                          final item = cart.items[index];
                          
                          String fullImageUrl = '';
                          if (item.product.imageUrl != null) {
                            if (item.product.imageUrl!.startsWith('http')) {
                              fullImageUrl = item.product.imageUrl!;
                            } else {
                              final baseUrl = ApiClient.baseUrl.replaceAll('/api', '');
                              fullImageUrl = '$baseUrl/${item.product.imageUrl}';
                            }
                          }

                          return Row(
                            children: [
                              // IMAGEN
                              Container(
                                width: 80,
                                height: 80,
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade200,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: item.product.imageUrl != null
                                    ? Image.network(fullImageUrl, fit: BoxFit.cover)
                                    : const Icon(Icons.shopping_bag),
                              ),
                              const SizedBox(width: 16),
                              
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item.product.title,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'L. ${item.product.price.toStringAsFixed(2)}',
                                      style: TextStyle(color: Colors.blue.shade700, fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(height: 8),
                                    
                                    Row(
                                      children: [
                                        _QuantityButton(
                                          icon: Icons.remove,
                                          onTap: () => cart.removeSingleItem(item.product.id),
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.symmetric(horizontal: 12),
                                          child: Text('${item.quantity}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                        ),
                                        _QuantityButton(
                                          icon: Icons.add,
                                          onTap: () => cart.addItem(item.product),
                                        ),
                                      ],
                                    )
                                  ],
                                ),
                              ),
                              
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    'L. ${item.total.toStringAsFixed(2)}',
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.close, size: 18, color: Colors.grey),
                                    onPressed: () => cart.removeItem(item.product.id),
                                  )
                                ],
                              )
                            ],
                          );
                        },
                      ),
                    ),

                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Total:', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                              Text(
                                'L. ${cart.totalAmount.toStringAsFixed(2)}',
                                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.blue.shade800),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Checkout en construcción 🚧')),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green, // Botón verde para pagar
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              child: const Text('IR A PAGAR', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
        );
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.shopping_cart_outlined, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text('Tu carrito está vacío', style: TextStyle(fontSize: 18, color: Colors.grey)),
        ],
      ),
    );
  }
}

class _QuantityButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _QuantityButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(4),
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: Colors.grey.shade100,
          borderRadius: BorderRadius.circular(4),
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: Icon(icon, size: 16),
      ),
    );
  }
}