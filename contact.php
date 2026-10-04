<?php
// Emails booking requests from the Contact page form to the business.
// Hostinger: create a mailbox on your domain (e.g. no-reply@boss1electromechanic-au.com)
// and set it as FROM_EMAIL so messages pass SPF and don't land in spam.

const TO_EMAIL   = 'mechanicalelectro918@gmail.com';
const FROM_EMAIL = 'no-reply@boss1electromechanic-au.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /contact');
    exit;
}

// Honeypot: bots fill the hidden "website" field.
if (!empty($_POST['website'])) {
    header('Location: /contact?sent=1');
    exit;
}

$clean = fn($key) => trim(str_replace(["\r", "\n"], ' ', strip_tags($_POST[$key] ?? '')));

$name    = $clean('name');
$phone   = $clean('phone');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL) ?: '';
$brand   = $clean('brand');
$type    = $clean('type');
$service = $clean('service');
$address = $clean('address');
$comment = trim(strip_tags($_POST['comment'] ?? ''));

// We need some way to reply: a phone number or a valid email.
if ($phone === '' && $email === '') {
    header('Location: /contact?error=1');
    exit;
}

$subject = 'Website booking request' . ($name ? " from $name" : '') . ($service ? " – $service" : '');
$body = "Name: $name\nPhone: $phone\nEmail: $email\n"
      . "Car: " . trim("$brand $type") . "\nJob: $service\nLocation: $address\n\nDetails:\n$comment\n";

$headers = [
    'From: BOSS 1 Website <' . FROM_EMAIL . '>',
    'Content-Type: text/plain; charset=UTF-8',
];
if ($email) {
    $headers[] = 'Reply-To: ' . $email;
}

$ok = mail(TO_EMAIL, $subject, $body, implode("\r\n", $headers));

header('Location: /contact' . ($ok ? '?sent=1' : '?error=1'));
exit;
