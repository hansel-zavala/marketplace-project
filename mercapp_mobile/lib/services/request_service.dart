import 'package:dio/dio.dart';
import '../config/api_client.dart';

class RequestService {
  Future<void> sendRequest({
    required int professionalId,
    required String title,
    required String description,
    required String serviceDate,
    required String location,
  }) async {
    try {
      await ApiClient.dio.post('/service-requests', data: {
        'professional_id': professionalId,
        'title': title,
        'description': description,
        'service_date': serviceDate,
        'location': location,
      });
    } on DioException catch (e) {
      print('Error enviando solicitud: $e');
      throw e.response?.data['message'] ?? 'Error al enviar solicitud';
    }
  }
}
