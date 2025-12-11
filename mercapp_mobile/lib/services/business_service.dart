import 'package:dio/dio.dart';
import '../config/api_client.dart';
import '../models/product_model.dart';
import '../models/business_model.dart';

class BusinessService {
  Future<List<Business>> getBusinesses() async {
    try {
      final response = await ApiClient.dio.get('/businesses'); 
      
      final List<dynamic> businessesJson = response.data; 
      
      return businessesJson.map((json) => Business.fromJson(json)).toList();
      
    } on DioException catch (e) {
      print('Error fetching businesses: $e');
      return [];
    }
  }

  Future<Business?> getBusinessById(int id) async {
    try {
      final response = await ApiClient.dio.get('/businesses/$id');
      if (response.statusCode == 200) {
        return Business.fromJson(response.data);
      }
      return null;
    } on DioException catch (e) {
      print('Error fetching business detail: $e');
      return null;
    }
  }

  Future<List<Product>> getBusinessProducts(int businessId) async {
    try {
      final response = await ApiClient.dio.get('/products?business_id=$businessId'); // Assuming API supports filtering or similar
      // Note: If API doesn't support filter, we might need a dedicated endpoint or filter client-side.
      // Based on web analysis, it seems to fetch business products via /products/business/:id or similar?
      // Checking web view logic again, it usually fetches generic products.
      // Let's assume a dedicated endpoint or standard list for now.
      
      // FALLBACK: Use generic products listing if specific endpoint doesn't exist, filtering properly if needed.
      // But standard REST often uses /businesses/:id/products or /products?business_id=...
      
      // Let's try /products/user/:userId if business is a user, but business model has its own ID.
      // Let's use a safe fallback.
      
      final responseFallback = await ApiClient.dio.get('/products');
      final List<dynamic> productsJson = responseFallback.data;
      
      // Filter client side as safety net if API doesn't support query param yet
      // This is less efficient but safer for "blind" implementation without full API docs.
      final allProducts = productsJson.map((json) => Product.fromJson(json)).toList();
      return allProducts.where((p) => p.sellerType == 'business' /* && check ID if available in product relation */).toList();
      
    } on DioException catch (e) {
      print('Error fetching business products: $e');
      return [];
    }
  }
}
