import 'product_model.dart';

class CartItem {
  final Product product;
  int quantity;

  CartItem({
    required this.product,
    this.quantity = 1,
  });

  double get total => product.price * quantity;

  Map<String, dynamic> toJson() {
    return {
      'product_id': product.id,
      'title': product.title,
      'price': product.price,
      'image_url': product.imageUrl,
      'seller_type': product.sellerType,
      'quantity': quantity,
    };
  }
}