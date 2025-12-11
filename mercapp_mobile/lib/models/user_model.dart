class User {
  final int id;
  final String uuid;
  final String firstName;
  final String lastName;
  final String email;
  final String userType;
  final String? profileImage;
  final String? phone;

  User({
    required this.id,
    required this.uuid,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.userType,
    this.profileImage,
    this.phone,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    int parseId(dynamic value) {
      if (value == null) return 0;
      if (value is int) return value;
      if (value is String) return int.tryParse(value) ?? 0;
      return 0;
    }

    return User(
      id: parseId(json['id']),
      uuid: json['uuid'] ?? '',
      firstName: json['first_name'] ?? 'Usuario',
      lastName: json['last_name'] ?? '',
      email: json['email'] ?? '',
      userType: json['user_type'] ?? 'client',
      profileImage: json['profile_image'],
      phone: json['phone'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'uuid': uuid,
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'user_type': userType,
      'profile_image': profileImage,
      'phone': phone,
    };
  }
}