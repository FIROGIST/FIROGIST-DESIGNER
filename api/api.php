<?php
// استقبال بيانات الزائر
$data = json_decode(file_get_contents('php://input'), true);
$data['time'] = date('Y-m-d H:i:s');

// حفظ في ملف
$file = '../visitors.json';
$visitors = [];
if (file_exists($file)) {
    $visitors = json_decode(file_get_contents($file), true);
}
array_push($visitors, $data);
file_put_contents($file, json_encode($visitors, JSON_PRETTY_PRINT));

// إرسال رد
header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'message' => 'تم استقبال البيانات']);
?>