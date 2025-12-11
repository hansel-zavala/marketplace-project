import 'package:dio/dio.dart';
import '../config/api_client.dart';
import '../models/professional_model.dart';

class ProfessionalService {
  Future<List<Professional>> getProfessionals() async {
    try {
      final response = await ApiClient.dio.get('/professionals'); 
      
      final List<dynamic> professionalsJson = response.data; 
      
      return professionalsJson.map((json) => Professional.fromJson(json)).toList();
      
    } on DioException catch (e) {
      print('Error trayendo profesionales: $e');
      throw e.response?.data['message'] ?? 'Error de conexión';
    }
  }
}
