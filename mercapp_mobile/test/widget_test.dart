import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mercapp_mobile/main.dart';

void main() {
  testWidgets('App starts and shows Login Screen', (WidgetTester tester) async {
    await tester.pumpWidget(const MercApp());

    expect(find.byType(ElevatedButton), findsOneWidget);
  });
}
