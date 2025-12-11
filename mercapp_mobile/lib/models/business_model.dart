class Business {
  final int id;
  final String businessName;
  final String category;
  final String city;
  final String? logo;

  Business({
    required this.id,
    required this.businessName,
    required this.category,
    required this.city,
    this.logo,
  });

  factory Business.fromJson(Map<String, dynamic> json) {
    return Business(
      id: json['id'],
      businessName: json['business_name'] ?? '',
      category: json['category'] ?? 'Tienda',
      city: json['city'] ?? 'Honduras',
      logo: json['logo'],
    );
  }
}
