import 'package:flutter/material.dart';
import '../models/product_model.dart';
import '../config/api_client.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';

class ProductDetailScreen extends StatelessWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    String fullImageUrl = '';
    if (product.imageUrl != null) {
      if (product.imageUrl!.startsWith('http')) {
        fullImageUrl = product.imageUrl!;
      } else {
        final baseUrl = ApiClient.baseUrl.replaceAll('/api', '');
        fullImageUrl = '$baseUrl/${product.imageUrl}';
      }
    }

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Container(
          margin: const EdgeInsets.all(8),
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black),
            onPressed: () => Navigator.pop(context),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 350,
              width: double.infinity,
              color: Colors.grey.shade200,
              child: product.imageUrl != null
                  ? Image.network(fullImageUrl, fit: BoxFit.cover)
                  : const Icon(Icons.image_not_supported, size: 80, color: Colors.grey),
            ),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Precio y Etiqueta
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'L. ${product.price.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue.shade800,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade50,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          product.sellerType == 'business' ? 'Tienda' : 'Vendedor',
                          style: TextStyle(color: Colors.blue.shade800, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  Text(
                    product.title,
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  
                  const Divider(),
                  
                  const Text(
                    "Descripción",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Aquí iría la descripción detallada del producto. Este es un excelente artículo disponible para compra inmediata.",
                    style: TextStyle(fontSize: 16, color: Colors.black54, height: 1.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
          ],
        ),
        child: ElevatedButton(
          onPressed: () {
            final cart = Provider.of<CartProvider>(context, listen: false);
            
            cart.addItem(product);

            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('¡${product.title} agregado al carrito! 🛒'),
                duration: const Duration(seconds: 2),
                action: SnackBarAction(
                  label: 'DESHACER',
                  onPressed: () {
                    cart.removeSingleItem(product.id);
                  },
                ),
              ),
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blue.shade700,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.shopping_cart),
              SizedBox(width: 8),
              Text('Agregar al Carrito', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }
}