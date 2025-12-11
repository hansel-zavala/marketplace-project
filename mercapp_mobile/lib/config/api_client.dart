import 'package:dio/dio.dart';

class ApiClient {

  static const String baseUrl = 'http://10.0.2.2:4000/api'; 

  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

  static Dio get dio => _dio;
  
  static void setToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }
  
  static void removeToken() {
    _dio.options.headers.remove('Authorization');
  }
}