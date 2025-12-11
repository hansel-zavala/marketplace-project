import 'package:dio/dio.dart';
import '../config/api_client.dart';
import '../models/review_model.dart';

class ReviewService {
  Future<List<Review>> getProductReviews(int productId) async {
    try {
      final response = await ApiClient.dio.get('/reviews/product/$productId');
      final List<dynamic> data = response.data;
      return data.map((json) => Review.fromJson(json)).toList();
    } on DioException catch (e) {
      print('Error fetching reviews: $e');
      return [];
    }
  }
}
