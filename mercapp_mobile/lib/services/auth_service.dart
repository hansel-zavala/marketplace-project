import 'package:dio/dio.dart';
import '../config/api_client.dart';
import '../models/user_model.dart';

class AuthService {
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await ApiClient.dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });
      return {
        'token': response.data['token'],
        'user': User.fromJson(response.data['user']),
      };
    } on DioException catch (e) {
      if (e.response != null) {
        throw e.response!.data['message'] ?? 'Error de autenticación';
      }
      throw 'Error de conexión con el servidor';
    }
  }

  Future<void> register(Map<String, dynamic> userData) async {
    try {
      await ApiClient.dio.post('/auth/register', data: userData);
    } on DioException catch (e) {
      throw e.response?.data['message'] ?? 'Error al registrarse';
    }
  }
}