import 'package:dio/dio.dart';
import '../config/api_client.dart';
import '../models/product_model.dart';
import '../models/professional_model.dart';
import '../models/business_model.dart';

class SearchResults {
  final List<Product> products;
  final List<Professional> professionals;
  final List<Business> businesses;

  SearchResults({
    this.products = const [],
    this.professionals = const [],
    this.businesses = const [],
  });

  factory SearchResults.fromJson(Map<String, dynamic> json) {
    return SearchResults(
      products: json['products'] != null
          ? (json['products'] as List).map((i) => Product.fromJson(i)).toList()
          : [],
      professionals: json['professionals'] != null
          ? (json['professionals'] as List).map((i) => Professional.fromJson(i)).toList()
          : [],
      businesses: json['businesses'] != null
          ? (json['businesses'] as List).map((i) => Business.fromJson(i)).toList()
          : [],
    );
  }
}

class SearchService {
  Future<SearchResults> searchGlobal(String query) async {
    try {
      final response = await ApiClient.dio.get('/search/global', queryParameters: {'q': query});
      return SearchResults.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Error searching: ${e.message}');
    }
  }
}
