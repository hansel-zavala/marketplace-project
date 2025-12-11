import 'package:dio/dio.dart';
import '../config/api_client.dart';
import '../models/business_model.dart';

class BusinessService {
  Future<List<Business>> getBusinesses() async {
    try {
      final response = await ApiClient.dio.get('/businesses'); 
      
      final List<dynamic> businessesJson = response.data; 
      
      return businessesJson.map((json) => Business.fromJson(json)).toList();
      
    } on DioException catch (e) {
      print('Error trayendo negocios: $e');
      throw e.response?.data['message'] ?? 'Error de conexión';
    }
  }
}
