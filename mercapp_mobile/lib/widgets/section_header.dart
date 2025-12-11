import 'package:flutter/material.dart';

class SectionHeader extends StatelessWidget {
  final String title;
  final VoidCallback? onMoreTap;

  const SectionHeader({
    super.key,
    required this.title,
    this.onMoreTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          if (onMoreTap != null)
            GestureDetector(
              onTap: onMoreTap,
              child: const Row(
                children: [
                   Text(
                    'Ver todos',
                    style: TextStyle(
                      color: Colors.blue,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                   Icon(Icons.arrow_forward_ios, size: 12, color: Colors.blue),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
