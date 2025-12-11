import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';
import '../config/api_client.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  
  User? _user;
  String? _token;
  bool _isLoading = false;

  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _token != null;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final data = await _authService.login(email, password);
      
      _token = data['token'];
      _user = data['user'];
      
      ApiClient.setToken(_token!);
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', _token!);

      _isLoading = false;
      notifyListeners();
      return true; // Login exitoso
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      print('Error Login: $e'); // Para depurar
      return false; // Falló
    }
  }

  Future<void> logout() async {
    _user = null;
    _token = null;
    ApiClient.removeToken();
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    
    notifyListeners();
  }
}