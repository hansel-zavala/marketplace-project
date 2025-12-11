import 'package:flutter/material.dart';
import '../models/product_model.dart';
import '../models/professional_model.dart';
import '../models/business_model.dart';
import '../services/product_service.dart';
import '../services/professional_service.dart';
import '../services/business_service.dart';
import '../widgets/product_card.dart';
import '../widgets/professional_card.dart';
import '../widgets/business_card.dart';
import '../widgets/section_header.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ProductService _productService = ProductService();
  final ProfessionalService _professionalService = ProfessionalService();
  final BusinessService _businessService = BusinessService();
  
  late Future<List<Product>> _productsFuture;
  late Future<List<Professional>> _professionalsFuture;
  late Future<List<Business>> _businessesFuture;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() {
    setState(() {
      _productsFuture = _productService.getProducts();
      _professionalsFuture = _professionalService.getProfessionals();
      _businessesFuture = _businessService.getBusinesses();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'MercApp',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Colors.black87),
            onPressed: () {},
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          _loadData();
          await Future.wait([_productsFuture, _professionalsFuture, _businessesFuture]);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              
              // 1. Recommended Experts
              SectionHeader(
                title: 'Expertos Recomendados',
                onMoreTap: () {},
              ),
              SizedBox(
                height: 280, 
                child: FutureBuilder<List<Professional>>(
                  future: _professionalsFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (snapshot.hasError) {
                      return const SizedBox(); 
                    } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                      return const Center(child: Text('No hay expertos disponibles'));
                    }

                    final professionals = snapshot.data!;
                    return ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      scrollDirection: Axis.horizontal,
                      itemCount: professionals.length,
                      itemBuilder: (context, index) {
                        return ProfessionalCard(professional: professionals[index]);
                      },
                    );
                  },
                ),
              ),

              const SizedBox(height: 24),

              // 2. Official Stores
              SectionHeader(
                title: 'Tiendas Oficiales',
                onMoreTap: () {},
              ),
              SizedBox(
                height: 200, 
                child: FutureBuilder<List<Business>>(
                  future: _businessesFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (snapshot.hasError) {
                      return const SizedBox();
                    } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                      return const Center(child: Text('No hay tiendas disponibles'));
                    }

                    final businesses = snapshot.data!;
                    return ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      scrollDirection: Axis.horizontal,
                      itemCount: businesses.length,
                      itemBuilder: (context, index) {
                        return BusinessCard(business: businesses[index]);
                      },
                    );
                  },
                ),
              ),

              const SizedBox(height: 24),

              // 3. Discovery of the Day
              const SectionHeader(
                title: 'Descubrimientos del Día',
              ),
              FutureBuilder<List<Product>>(
                future: _productsFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Padding(
                      padding: EdgeInsets.all(32.0),
                      child: Center(child: CircularProgressIndicator()),
                    );
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return const Padding(
                      padding: EdgeInsets.all(32.0),
                      child: Center(child: Text('No hay productos disponibles')),
                    );
                  }

                  final products = snapshot.data!;

                  return GridView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.75,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: products.length,
                    itemBuilder: (context, index) {
                      return ProductCard(product: products[index]);
                    },
                  );
                },
              ),
              
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
