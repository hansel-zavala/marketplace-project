class Product {
  final int id;
  final String title;
  final double price;
  final String? imageUrl;
  final List<String> images;
  final String sellerType;
  final String? description;
  final int stock;
  final String condition;
  final Map<String, dynamic>? seller;

  Product({
    required this.id,
    required this.title,
    required this.price,
    this.imageUrl,
    this.images = const [],
    required this.sellerType,
    this.description,
    this.stock = 0,
    this.condition = 'new',
    this.seller,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    List<String> imgs = [];
    String? mainImg;
    
    if (json['images'] != null && (json['images'] as List).isNotEmpty) {
      mainImg = json['images'][0]['image_url'];
      imgs = (json['images'] as List).map((i) => i['image_url'].toString()).toList();
    }

    return Product(
      id: json['id'],
      title: json['title'],
      price: double.tryParse(json['price'].toString()) ?? 0.0,
      imageUrl: mainImg,
      images: imgs,
      sellerType: json['seller_type'] ?? 'user',
      description: json['description'],
      stock: json['stock'] ?? 0,
      condition: json['condition'] ?? 'new',
      seller: json['seller'],
    );
  }
}