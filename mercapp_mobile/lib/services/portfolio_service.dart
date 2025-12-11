import 'package:dio/dio.dart';
import '../config/api_client.dart';
import '../models/portfolio_model.dart';

class PortfolioService {
  Future<List<PortfolioProject>> getPortfolio(int professionalId) async {
    try {
      final response = await ApiClient.dio.get('/portfolio/$professionalId'); 
      
      final List<dynamic> portfolioJson = response.data; 
      
      return portfolioJson.map((json) => PortfolioProject.fromJson(json)).toList();
      
    } on DioException catch (e) {
      print('Error trayendo portafolio: $e');
      return [];
    }
  }
}
