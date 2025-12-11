import 'package:flutter/material.dart';
import '../models/business_model.dart';
import '../config/api_client.dart';

import '../screens/business_detail_screen.dart';

class BusinessCard extends StatelessWidget {
  final Business business;

  const BusinessCard({super.key, required this.business});

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
            builder: (context) => BusinessDetailScreen(business: business),
          ),
        );
      },
      child: Container(
        width: 160,
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
          children: [
            // Header color + Logo
            SizedBox(
              height: 80,
              child: Stack(
                alignment: Alignment.center,
                clipBehavior: Clip.none,
                children: [
                  // Background gradient look-alike
                  Container(
                    height: 50,
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.blue, Colors.indigo],
                      ),
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(12),
                        topRight: Radius.circular(12),
                      ),
                    ),
                  ),
                  // Logo
                  Positioned(
                    top: 20,
                    child: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [
                           BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(4.0),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: business.logo != null
                              ? Image.network(
                                  getImageUrl(business.logo),
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) =>
                                       const Icon(Icons.store, color: Colors.grey),
                                )
                              : const Icon(Icons.store, color: Colors.grey),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 8),
            
            // Info
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: Column(
                children: [
                  Text(
                    business.businessName,
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
                    business.category,
                    style: const TextStyle(
                      color: Colors.grey,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.5,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                    
                  ),
                ],
              ),
            ),
            
            const Spacer(),
            
            // Location
             Row(
               mainAxisAlignment: MainAxisAlignment.center,
              children: [
                 const Icon(Icons.location_on, size: 12, color: Colors.grey),
                 const SizedBox(width: 4),
                Flexible(
                  child: Text(
                    business.city,
                    style: const TextStyle(fontSize: 10, color: Colors.grey),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}
