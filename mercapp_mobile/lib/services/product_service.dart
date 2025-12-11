import 'package:dio/dio.dart';
import '../config/api_client.dart';
import '../models/product_model.dart';

class ProductService {
  Future<List<Product>> getProducts() async {
    try {
      final response = await ApiClient.dio.get('/products'); 
      
      final List<dynamic> productsJson = response.data; 
      
      return productsJson.map((json) => Product.fromJson(json)).toList();
      
    } on DioException catch (e) {
      print('Error trayendo productos: $e');
      throw e.response?.data['message'] ?? 'Error de conexión';
    }
  }
}