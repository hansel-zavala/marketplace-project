import 'package:flutter/material.dart';
import '../models/professional_model.dart';
import '../config/api_client.dart';
import '../screens/professional_detail_screen.dart';

class ProfessionalCard extends StatelessWidget {
  final Professional professional;

  const ProfessionalCard({super.key, required this.professional});

  String getImageUrl(String? path) {
    if (path == null) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = ApiClient.baseUrl;
    final rootUrl = baseUrl.replaceAll('/api', '');
    return '$rootUrl/${path.replaceAll(r'\', '/')}';
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProfessionalDetailScreen(professional: professional),
          ),
        );
      },
      child: Container(
        width: 180,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 16),
            // Avatar
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: Colors.grey.shade100, width: 3),
              ),
              child: ClipOval(
                child: professional.user?.profileImage != null
                    ? Image.network(
                        getImageUrl(professional.user!.profileImage),
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          color: Colors.grey.shade100,
                          child: const Icon(Icons.person, size: 40, color: Colors.grey),
                        ),
                      )
                    : Container(
                        color: Colors.grey.shade100,
                        child: const Icon(Icons.person, size: 40, color: Colors.grey),
                      ),
              ),
            ),

            const SizedBox(height: 12),

            // Name and Profession
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: Column(
                children: [
                  Text(
                    '${professional.user?.firstName} ${professional.user?.lastName}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    professional.profession,
                    style: const TextStyle(
                      color: Colors.blue,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 8),

            // Rating
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.star, size: 12, color: Colors.amber),
                  const SizedBox(width: 4),
                  Text(
                    professional.rating,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87),
                  ),
                  if (professional.totalJobs > 0) ...[
                     const SizedBox(width: 4),
                     Text(
                      '(${professional.totalJobs})',
                      style: const TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                  ]
                ],
              ),
            ),

            const Spacer(),

            // Footer (Fee & Location)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(12),
                  bottomRight: Radius.circular(12),
                ),
                border: Border(top: BorderSide(color: Colors.grey.shade100)),
              ),
              child: Row(
                children: [
                   Expanded(
                     child: Column(
                       children: [
                         Text(
                          'L. ${professional.fee}',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                         ),
                         Text(
                          professional.billingType == 'hourly' ? '/ hora' : professional.billingType == 'daily' ? '/ día' : 'base',
                          style: const TextStyle(fontSize: 10, color: Colors.grey),
                         )
                       ],
                     ),
                   ),
                   Container(width: 1, height: 24, color: Colors.grey.shade300),
                   Expanded(
                     child: Column(
                       children: [
                         Text(
                           professional.department,
                           style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black87),
                           textAlign: TextAlign.center,
                           maxLines: 1,
                           overflow: TextOverflow.ellipsis,
                         ),
                         Text(
                           professional.municipality,
                           style: const TextStyle(fontSize: 9, color: Colors.grey),
                           textAlign: TextAlign.center,
                           maxLines: 1,
                           overflow: TextOverflow.ellipsis,
                         ),
                       ],
                     ),
                   )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
