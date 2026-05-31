<?php
// استقبال بيانات الزائر وحفظها في ملف JSON

// السماح بالطلبات من أي مكان (CORS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// استقبال البيانات
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'لا توجد بيانات']);
    exit;
}

// إضافة وقت الاستقبال
$data['received_at'] = date('Y-m-d H:i:s');

// ملف التخزين
$file = '../visitors.json';
$visitors = [];

if (file_exists($file)) {
    $content = file_get_contents($file);
    if ($content) {
        $visitors = json_decode($content, true);
        if (!is_array($visitors)) $visitors = [];
    }
}

// إضافة البيانات الجديدة
array_unshift($visitors, $data); // إضافة في البداية (الأحدث أولاً)

// الحفاظ على آخر 100 زيارة فقط (عشان الملف ما يتضخمش)
if (count($visitors) > 100) {
    $visitors = array_slice($visitors, 0, 100);
}

// حفظ في الملف
file_put_contents($file, json_encode($visitors, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(['status' => 'success', 'message' => 'تم حفظ البيانات']);
?>