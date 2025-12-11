import 'package:flutter/material.dart';
import '../models/business_model.dart';
import '../models/product_model.dart';
import '../services/business_service.dart';
import '../config/api_client.dart';
import 'product_detail_screen.dart';
import 'package:url_launcher/url_launcher.dart';

class BusinessDetailScreen extends StatefulWidget {
  final Business business;

  const BusinessDetailScreen({super.key, required this.business});

  @override
  State<BusinessDetailScreen> createState() => _BusinessDetailScreenState();
}

class _BusinessDetailScreenState extends State<BusinessDetailScreen> {
  final BusinessService _businessService = BusinessService();
  late Future<List<Product>> _productsFuture;

  @override
  void initState() {
    super.initState();
    _productsFuture = _businessService.getBusinessProducts(widget.business.id);
  }

  String getImageUrl(String? path) {
    if (path == null) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = ApiClient.baseUrl;
    final rootUrl = baseUrl.replaceAll('/api', '');
    return '$rootUrl/${path.replaceAll(r'\', '/')}';
  }

  Future<void> _launchUrl(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // HEADER STACK (Banner + Logo + Back Button)
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.bottomCenter,
              children: [
                // BANNER
                Container(
                  height: 220,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.blue.shade800,
                  ),
                  child: widget.business.banner != null
                      ? Image.network(
                          getImageUrl(widget.business.banner),
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [Colors.blue.shade700, Colors.blue.shade900],
                                  ),
                                ),
                                child: const Center(
                                  child: Icon(Icons.storefront, size: 60, color: Colors.white24),
                                ),
                              ),
                        )
                      : Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [Colors.blue.shade700, Colors.blue.shade900],
                            ),
                          ),
                          child: const Center(
                            child: Icon(Icons.storefront, size: 60, color: Colors.white24),
                          ),
                        ),
                ),
                
                // BACK BUTTON & SHARE
                Positioned(
                  top: MediaQuery.of(context).padding.top + 10,
                  left: 10,
                  child: CircleAvatar(
                    backgroundColor: Colors.black26,
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                ),

                // LOGO (Overlapping)
                Positioned(
                  bottom: -50,
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 4),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.15),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: CircleAvatar(
                      radius: 50,
                      backgroundColor: Colors.white,
                      backgroundImage: widget.business.logo != null
                          ? NetworkImage(getImageUrl(widget.business.logo))
                          : null,
                      child: widget.business.logo == null
                          ? const Icon(Icons.store, size: 50, color: Colors.blue)
                          : null,
                    ),
                  ),
                ),
              ],
            ),

            // Spacer for logo overlap
            const SizedBox(height: 60),

            // BUSINESS INFO
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: [
                  Text(
                    widget.business.businessName,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      widget.business.category,
                      style: TextStyle(
                        color: Colors.blue.shade700,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // CONTENT
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ABOUT
                  if (widget.business.description != null) ...[
                    const Text(
                      'Sobre Nosotros',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      widget.business.description!,
                      style: TextStyle(color: Colors.grey.shade700, height: 1.5, fontSize: 14),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // CONTACT
                  const Text(
                    'Datos de Contacto',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
                  ),
                  const SizedBox(height: 12),
                  Card(
                    elevation: 0,
                    color: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: Colors.grey.shade200),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          if (widget.business.address != null)
                            _buildContactRow(Icons.location_on, 'Dirección', widget.business.address!, Colors.redAccent),
                          if (widget.business.city.isNotEmpty) ...[
                             if (widget.business.address != null) const Divider(height: 24),
                            _buildContactRow(Icons.map, 'Ciudad', widget.business.city, Colors.green),
                          ],
                          if (widget.business.phoneNumber != null) ...[
                            const Divider(height: 24),
                            _buildContactRow(Icons.phone, 'Teléfono', widget.business.phoneNumber!, Colors.blue),
                          ],
                          if (widget.business.email != null) ...[
                            const Divider(height: 24),
                            _buildContactRow(Icons.email, 'Correo', widget.business.email!, Colors.orange),
                          ],
                           if (widget.business.rtn != null) ...[
                            const Divider(height: 24),
                            _buildContactRow(Icons.badge, 'RTN', widget.business.rtn!, Colors.purple),
                          ],
                          if (widget.business.website != null) ...[
                            const Divider(height: 24),
                            InkWell(
                              onTap: () => _launchUrl(widget.business.website!),
                              child: _buildContactRow(Icons.language, 'Sitio Web', widget.business.website!, Colors.teal, isLink: true),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),
                  
                  // CATALOG HEADER
                  const Text(
                    'Catálogo',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
                  ),
                  const SizedBox(height: 16),
                  
                  // PRODUCTS GRIDS
                  FutureBuilder<List<Product>>(
                    future: _productsFuture,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: Padding(padding: EdgeInsets.all(40), child: CircularProgressIndicator()));
                      } else if (snapshot.hasError || !snapshot.hasData || snapshot.data!.isEmpty) {
                        return Container(
                          padding: const EdgeInsets.all(40),
                          alignment: Alignment.center,
                          child: const Column(
                            children: [
                              Icon(Icons.inventory_2_outlined, size: 48, color: Colors.grey),
                              SizedBox(height: 12),
                              Text('Sin productos disponibles', style: TextStyle(color: Colors.grey)),
                            ],
                          ),
                        );
                      }

                      final products = snapshot.data!;
                      return GridView.builder(
                        physics: const NeverScrollableScrollPhysics(), // Scroll handled by parent
                        shrinkWrap: true,
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.7,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                        ),
                        itemCount: products.length,
                        itemBuilder: (context, index) {
                          final product = products[index];
                          return GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => ProductDetailScreen(product: product),
                                ),
                              );
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.04),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                                border: Border.all(color: Colors.grey.shade100),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: ClipRRect(
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                      child: Container(
                                        width: double.infinity,
                                        color: Colors.grey.shade50,
                                        child: product.imageUrl != null
                                            ? Image.network(
                                                getImageUrl(product.imageUrl),
                                                fit: BoxFit.cover,
                                                errorBuilder: (context, error, stackTrace) =>
                                                    const Center(child: Icon(Icons.image_not_supported, color: Colors.grey)),
                                              )
                                            : const Center(child: Icon(Icons.shopping_bag_outlined, color: Colors.grey)),
                                      ),
                                    ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.all(10.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          product.title,
                                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Colors.black87),
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        const SizedBox(height: 6),
                                        Text(
                                          'L. ${product.price}',
                                          style: const TextStyle(
                                            color: Colors.blue,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                  
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String label, String value, Color iconColor, {bool isLink = false}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  color: Colors.grey.shade500,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  color: isLink ? Colors.blue : Colors.black87,
                  fontWeight: FontWeight.w500,
                  fontSize: 14,
                  decoration: isLink ? TextDecoration.underline : null,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
