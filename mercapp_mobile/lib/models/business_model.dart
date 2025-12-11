class Business {
  final int id;
  final String businessName;
  final String category;
  final String? logo;
  final String city;
  final String? address;
  final String? phoneNumber;
  final String? email;
  final String? website;
  final String? description;
  final String? banner;
  final String? rtn;

  Business({
    required this.id,
    required this.businessName,
    required this.category,
    this.logo,
    required this.city,
    this.address,
    this.phoneNumber,
    this.email,
    this.website,
    this.description,
    this.banner,
    this.rtn,
  });

  factory Business.fromJson(Map<String, dynamic> json) {
    return Business(
      id: json['id'],
      businessName: json['business_name'] ?? '',
      category: json['category'] ?? 'Tienda',
      logo: json['logo'],
      city: json['city'] ?? 'Honduras',
      address: json['address'],
      phoneNumber: json['phone_number'],
      email: json['email'],
      website: json['website'],
      description: json['description'],
      banner: json['banner'],
      rtn: json['rtn'],
    );
  }
}
