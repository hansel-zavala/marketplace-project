class PortfolioProject {
  final String id;
  final String title;
  final String description;
  final List<String> images;

  PortfolioProject({
    required this.id,
    required this.title,
    required this.description,
    required this.images,
  });

  factory PortfolioProject.fromJson(Map<String, dynamic> json) {
    return PortfolioProject(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      images: json['images'] != null 
          ? List<String>.from(json['images']) 
          : [],
    );
  }
}
