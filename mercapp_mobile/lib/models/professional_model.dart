class ProfessionalUser {
  final String firstName;
  final String lastName;
  final String? profileImage;

  ProfessionalUser({
    required this.firstName,
    required this.lastName,
    this.profileImage,
  });

  factory ProfessionalUser.fromJson(Map<String, dynamic> json) {
    return ProfessionalUser(
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      profileImage: json['profile_image'],
    );
  }
}

class Professional {
  final int id;
  final String profession;
  final String rating;
  final int totalJobs;
  final double fee;
  final String billingType;
  final String department;
  final String municipality;
  final String? bio;
  final int experienceYears;
  final ProfessionalUser? user;

  Professional({
    required this.id,
    required this.profession,
    required this.rating,
    required this.totalJobs,
    required this.fee,
    required this.billingType,
    required this.department,
    required this.municipality,
    this.bio,
    this.experienceYears = 0,
    this.user,
  });

  factory Professional.fromJson(Map<String, dynamic> json) {
    return Professional(
      id: json['id'],
      profession: json['profession'] ?? '',
      rating: json['rating']?.toString() ?? 'New',
      totalJobs: json['total_jobs'] ?? 0,
      fee: double.tryParse(json['fee'].toString()) ?? 0.0,
      billingType: json['billing_type'] ?? '',
      department: json['department'] ?? '',
      municipality: json['municipality'] ?? '',
      bio: json['bio'],
      experienceYears: json['experience_years'] ?? 0,
      user: json['User'] != null ? ProfessionalUser.fromJson(json['User']) : null,
    );
  }
}
