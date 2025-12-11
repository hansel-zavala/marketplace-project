import 'package:flutter/material.dart';
import '../models/product_model.dart';
import '../models/review_model.dart';
import '../services/product_service.dart';
import '../services/review_service.dart';
import '../config/api_client.dart';
import 'business_detail_screen.dart';
import 'professional_detail_screen.dart';
import '../services/business_service.dart';
import '../services/professional_service.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final ProductService _productService = ProductService();
  final ReviewService _reviewService = ReviewService();
  final BusinessService _businessService = BusinessService();
  final ProfessionalService _professionalService = ProfessionalService();

  late Future<Product?> _fullProductFuture;
  late Future<List<Review>> _reviewsFuture;
  
  Product? _fullProduct;
  String? _selectedImage;
  int _quantity = 1;

  @override
  void initState() {
    super.initState();
    // Start with the passed product, but fetch full details to get description/seller/etc if missing
    _fullProduct = widget.product;
    if (_fullProduct?.imageUrl != null) {
      _selectedImage = _fullProduct!.imageUrl;
    }
    
    _fullProductFuture = _productService.getProductById(widget.product.id);
    _reviewsFuture = _reviewService.getProductReviews(widget.product.id);
  }

  String getImageUrl(String? path) {
    if (path == null) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = ApiClient.baseUrl;
    final rootUrl = baseUrl.replaceAll('/api', '');
    return '$rootUrl/${path.replaceAll(r'\', '/')}';
  }

  void _showFullImage(BuildContext context, String imageUrl) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.black,
        insetPadding: EdgeInsets.zero,
        child: Stack(
          alignment: Alignment.center,
          children: [
            InteractiveViewer(
              child: Image.network(imageUrl, fit: BoxFit.contain),
            ),
            Positioned(
              top: 40,
              right: 20,
              child: IconButton(
                icon: const Icon(Icons.close, color: Colors.white, size: 30),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _navigateToSeller(BuildContext context, Product product) async {
    if (product.seller == null) return;

    if (product.sellerType == 'business') {
      final business = await _businessService.getBusinessById(product.seller!['id']);
      if (business != null && context.mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => BusinessDetailScreen(business: business)),
        );
      }
    } else if (product.sellerType == 'professional') {
      try {
        final professionals = await _professionalService.getProfessionals();
        final professional = professionals.firstWhere(
          (p) => p.id == product.seller!['id'], 
          orElse: () => professionals.first // Fallback is risky but prevents crash if specific not found
        );

        if (context.mounted) {
           Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => ProfessionalDetailScreen(professional: professional)),
          );
        }
      } catch (e) {
        print('Error navigating to professional: $e');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.product.title, style: const TextStyle(fontSize: 18)),
        actions: [
          IconButton(icon: const Icon(Icons.share), onPressed: () {}),
        ],
      ),
      body: FutureBuilder<Product?>(
        future: _fullProductFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done && snapshot.data != null) {
            _fullProduct = snapshot.data;
             if (_selectedImage == null && _fullProduct!.imageUrl != null) {
              _selectedImage = _fullProduct!.imageUrl;
            }
          }
          
          final product = _fullProduct ?? widget.product;

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // MAIN IMAGE
                GestureDetector(
                  onTap: _selectedImage != null 
                      ? () => _showFullImage(context, getImageUrl(_selectedImage!)) 
                      : null,
                  child: Container(
                    height: 300,
                    width: double.infinity,
                    color: Colors.white,
                    child: _selectedImage != null
                        ? Image.network(
                            getImageUrl(_selectedImage!),
                            fit: BoxFit.contain,
                            errorBuilder: (context, error, stackTrace) =>
                                const Center(child: Icon(Icons.image_not_supported, size: 50, color: Colors.grey)),
                          )
                        : const Center(child: Icon(Icons.image_not_supported, size: 64, color: Colors.grey)),
                  ),
                ),

                // THUMBNAILS
                if (product.images.isNotEmpty)
                  Container(
                    height: 80,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: product.images.length,
                      itemBuilder: (context, index) {
                        final img = product.images[index];
                        return GestureDetector(
                          onTap: () => setState(() => _selectedImage = img),
                          child: Container(
                            width: 60,
                            margin: const EdgeInsets.only(right: 8),
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: _selectedImage == img ? Colors.blue : Colors.grey.shade300,
                                width: 2,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(6),
                              child: Image.network(
                                getImageUrl(img),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),

                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // TITLE & PRICE
                      Text(
                        product.title,
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'L. ${product.price}',
                        style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.blue),
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // STOCK & ADD TO CART
                       if (product.stock > 0) ...[
                        Row(
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey.shade300),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                children: [
                                  IconButton(
                                    onPressed: _quantity > 1 ? () => setState(() => _quantity--) : null,
                                    icon: const Icon(Icons.remove),
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
                                  ),
                                  Text('$_quantity', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                                  IconButton(
                                    onPressed: _quantity < product.stock ? () => setState(() => _quantity++) : null,
                                    icon: const Icon(Icons.add),
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Agregado al carrito (Simulado)')),
                                  );
                                },
                                icon: const Icon(Icons.shopping_cart),
                                label: const Text('Agregar'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.blue,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                              ),
                            ),
                          ],
                        ),
                       ] else 
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(8)),
                          child: const Text('Producto Agotado', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                        ),

                      const SizedBox(height: 24),
                      const Divider(),
                      const SizedBox(height: 16),

                      // DESCRIPTION
                      const Text(
                        'Descripción',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        product.description ?? 'Sin descripción detallada.',
                        style: TextStyle(fontSize: 16, color: Colors.grey.shade700, height: 1.5),
                      ),

                      const SizedBox(height: 24),

                      // SELLER INFO
                      if (product.seller != null) ...[
                        const Text('Vendido por', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey)),
                        const SizedBox(height: 8),
                        GestureDetector(
                          onTap: () => _navigateToSeller(context, product),
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade50,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.grey.shade200),
                            ),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 24,
                                  backgroundColor: Colors.white,
                                  backgroundImage: NetworkImage(
                                    getImageUrl(
                                      product.sellerType == 'business' 
                                        ? product.seller!['logo'] 
                                        : product.seller!['User']?['profile_image']
                                    )
                                  ),
                                  onBackgroundImageError: (_, __) => const Icon(Icons.person),
                                  child: product.seller!['logo'] == null && product.seller!['User']?['profile_image'] == null
                                      ? const Icon(Icons.store, color: Colors.grey)
                                      : null,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        product.sellerType == 'business' 
                                          ? product.seller!['business_name'] ?? 'Tienda'
                                          : '${product.seller!['User']?['first_name']} ${product.seller!['User']?['last_name']}',
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                      ),
                                      Text(
                                        product.sellerType == 'business' ? 'Ver perfil de la tienda' : 'Ver perfil del profesional',
                                        style: const TextStyle(color: Colors.blue, fontSize: 12),
                                      ),
                                    ],
                                  ),
                                ),
                                const Icon(Icons.chevron_right, color: Colors.grey),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],

                      const Divider(),
                      const SizedBox(height: 16),

                      // REVIEWS
                      const Text(
                        'Valoraciones',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16),
                      
                      FutureBuilder<List<Review>>(
                        future: _reviewsFuture,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState == ConnectionState.waiting) {
                             return const Center(child: CircularProgressIndicator());
                          }
                          if (snapshot.hasError || !snapshot.hasData || snapshot.data!.isEmpty) {
                            return const Text('Aún no hay valoraciones para este producto.', style: TextStyle(color: Colors.grey));
                          }
                          
                          final reviews = snapshot.data!;
                          return Column(
                            children: reviews.map((review) => Container(
                              margin: const EdgeInsets.only(bottom: 16),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.grey.shade100),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(review.authorName, style: const TextStyle(fontWeight: FontWeight.bold)),
                                      Row(
                                        children: [
                                          const Icon(Icons.star, size: 16, color: Colors.amber),
                                          Text(review.rating.toString(), style: const TextStyle(fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(review.comment, style: TextStyle(color: Colors.grey.shade700)),
                                ],
                              ),
                            )).toList(),
                          );
                        },
                      ),
                      
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
