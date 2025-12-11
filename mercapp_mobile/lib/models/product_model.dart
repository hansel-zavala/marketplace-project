class Product {
  final int id;
  final String title;
  final double price;
  final String? imageUrl;
  final String sellerType;

  Product({
    required this.id,
    required this.title,
    required this.price,
    this.imageUrl,
    required this.sellerType,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    String? img;
    if (json['images'] != null && (json['images'] as List).isNotEmpty) {
      img = json['images'][0]['image_url'];
    }

    return Product(
      id: json['id'],
      title: json['title'],
      price: double.tryParse(json['price'].toString()) ?? 0.0,
      imageUrl: img,
      sellerType: json['seller_type'] ?? 'user',
    );
  }
}