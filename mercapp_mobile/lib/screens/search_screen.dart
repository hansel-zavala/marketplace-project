import 'package:flutter/material.dart';
import 'dart:async';
import '../models/product_model.dart';
import '../models/professional_model.dart';
import '../models/business_model.dart';
import '../services/search_service.dart';
import '../widgets/product_card.dart';
import '../widgets/professional_card.dart';
import '../widgets/business_card.dart';
import '../config/api_client.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  final SearchService _searchService = SearchService();
  Timer? _debounce;
  SearchResults? _results;
  bool _isLoading = false;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _debounce?.cancel();
    _tabController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      if (query.isNotEmpty) {
        _performSearch(query);
      } else {
        setState(() {
          _results = null;
        });
      }
    });
  }

  Future<void> _performSearch(String query) async {
    setState(() {
      _isLoading = true;
    });

    try {
      final results = await _searchService.searchGlobal(query);
      setState(() {
        _results = results;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al buscar: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
  
  String getImageUrl(String? path) {
    if (path == null) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = ApiClient.baseUrl;
    final rootUrl = baseUrl.replaceAll('/api', '');
    return '$rootUrl/${path.replaceAll(r'\', '/')}';
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Buscar productos, servicios, tiendas...',
            border: InputBorder.none,
            hintStyle: TextStyle(color: Colors.white70),
          ),
          style: const TextStyle(color: Colors.white),
          onChanged: _onSearchChanged,
        ),
        backgroundColor: Colors.blue.shade800,
        iconTheme: const IconThemeData(color: Colors.white),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          isScrollable: true,
          tabs: const [
            Tab(text: 'Todos'),
            Tab(text: 'Productos'),
            Tab(text: 'Expertos'),
            Tab(text: 'Negocios'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _results == null
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.search, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('Escribe para buscar', style: TextStyle(color: Colors.grey, fontSize: 16)),
                    ],
                  ),
                )
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildAllResults(),
                    _buildProductList(_results!.products),
                    _buildProfessionalList(_results!.professionals),
                    _buildBusinessList(_results!.businesses),
                  ],
                ),
    );
  }

  Widget _buildAllResults() {
    if (_results!.products.isEmpty && _results!.professionals.isEmpty && _results!.businesses.isEmpty) {
      return _buildEmptyState();
    }
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (_results!.businesses.isNotEmpty) ...[
            _buildSectionHeader('Negocios', 3),
            ..._results!.businesses.take(2).map((b) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: SizedBox(
                    height: 200, 
                    child: BusinessCard(business: b),
                  ),
                )),
          ],
          if (_results!.professionals.isNotEmpty) ...[
            _buildSectionHeader('Expertos', 2),
            ..._results!.professionals.take(2).map((p) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: SizedBox(
                    height: 280,
                    child: ProfessionalCard(professional: p),
                  ),
                )),
          ],
          if (_results!.products.isNotEmpty) ...[
             _buildSectionHeader('Productos', 1),
             GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.75,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                ),
                itemCount: _results!.products.length > 4 ? 4 : _results!.products.length,
                itemBuilder: (context, index) {
                  return ProductCard(product: _results!.products[index]);
                },
              ),
          ],
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, int tabIndex) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          TextButton(
            onPressed: () => _tabController.animateTo(tabIndex),
            child: const Text('Ver más'),
          ),
        ],
      ),
    );
  }

  Widget _buildProductList(List<Product> products) {
     if (products.isEmpty) return _buildEmptyState();
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.75,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) => ProductCard(product: products[index]),
    );
  }

  Widget _buildProfessionalList(List<Professional> professionals) {
    if (professionals.isEmpty) return _buildEmptyState();
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: professionals.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) => SizedBox(
        height: 280,
        child: Center(child: ProfessionalCard(professional: professionals[index])),
      ),
    );
  }

  Widget _buildBusinessList(List<Business> businesses) {
    if (businesses.isEmpty) return _buildEmptyState();
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: businesses.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) => SizedBox(
        height: 200,
        child: Center(child: BusinessCard(business: businesses[index])),
      ),
    );
  }

  Widget _buildEmptyState() {
    return const Center(
      child: Text('No se encontraron resultados', style: TextStyle(color: Colors.grey)),
    );
  }
}
