class Review {
  final int id;
  final int rating;
  final String comment;
  final String authorName;
  final String createdAt;

  Review({
    required this.id,
    required this.rating,
    required this.comment,
    required this.authorName,
    required this.createdAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    String name = 'Usuario';
    if (json['Author'] != null) {
      name = '${json['Author']['first_name']} ${json['Author']['last_name']}';
    }
    return Review(
      id: json['id'],
      rating: json['rating'] ?? 0,
      comment: json['comment'] ?? '',
      authorName: name,
      createdAt: json['created_at'] ?? '',
    );
  }
}
