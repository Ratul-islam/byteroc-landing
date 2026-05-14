<?php
// Import PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load the PHPMailer files
require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// Check if the form was actually submitted via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Identify which form was submitted
    $formType = $_POST['form_type'] ?? 'Unknown Form';
    
    // Initialize variables for email content
    $subject = "";
    $body = "";

    // =========================================================
    // PAGE 1: SHOPIFY E-COMMERCE FORMS
    // =========================================================

    // 1. General Email Audit
    if ($formType == 'email_audit') {
        $subject = "Shopify Lead: New Email Audit Request";
        $name = htmlspecialchars($_POST['user_name']);
        $email = htmlspecialchars($_POST['user_email']);
        $url = htmlspecialchars($_POST['user_url']);
        $esp = !empty($_POST['user_esp']) ? htmlspecialchars($_POST['user_esp']) : 'None provided';
        
        $body = "<h2>Shopify Store Audit Request</h2>
                 <p><strong>Name:</strong> {$name}</p>
                 <p><strong>Email:</strong> {$email}</p>
                 <p><strong>Website URL:</strong> {$url}</p>
                 <p><strong>Current ESP:</strong> {$esp}</p>";

    // 2. Score Quiz Form
    } elseif ($formType == 'score_audit_form') {
        $subject = "Shopify Lead: Audit Request (From Score Quiz)";
        $name = htmlspecialchars($_POST['user_name']);
        $email = htmlspecialchars($_POST['user_email']);
        $url = htmlspecialchars($_POST['user_url']);
        $revenue = htmlspecialchars($_POST['user_revenue']);
        
        $body = "<h2>Shopify Store Audit Request (Score Quiz)</h2>
                 <p><strong>Name:</strong> {$name}</p>
                 <p><strong>Email:</strong> {$email}</p>
                 <p><strong>Store URL:</strong> {$url}</p>
                 <p><strong>Revenue Range:</strong> {$revenue}</p>";

    // 3. Offer Section Form
    } elseif ($formType == 'offer_audit_form') {
        $subject = "Shopify Lead: Audit Request (From Offer Section)";
        $name = htmlspecialchars($_POST['user_name']);
        $email = htmlspecialchars($_POST['user_email']);
        $url = htmlspecialchars($_POST['user_url']);
        $platform = htmlspecialchars($_POST['user_platform']);
        
        $body = "<h2>Shopify Store Audit Request (Offer Section)</h2>
                 <p><strong>Name:</strong> {$name}</p>
                 <p><strong>Email:</strong> {$email}</p>
                 <p><strong>Store URL:</strong> {$url}</p>
                 <p><strong>Email Platform:</strong> {$platform}</p>";

    // =========================================================
    // PAGE 2: COACH / LAUNCH SEQUENCE FORMS
    // =========================================================

    // 4. Launch Score Audit Form
    } elseif ($formType == 'launch_score_audit') {
        $subject = "Coach Lead: Launch Audit (From Score Quiz)";
        $name = htmlspecialchars($_POST['user_name']);
        $email = htmlspecialchars($_POST['user_email']);
        $url = htmlspecialchars($_POST['user_url']);
        $platform = htmlspecialchars($_POST['user_platform']);
        $list_size = htmlspecialchars($_POST['user_list_size']);
        
        $body = "<h2>Coach Launch Audit Request (Score Quiz)</h2>
                 <p><strong>Name:</strong> {$name}</p>
                 <p><strong>Email:</strong> {$email}</p>
                 <p><strong>Website URL:</strong> {$url}</p>
                 <p><strong>Platform:</strong> {$platform}</p>
                 <p><strong>List Size:</strong> {$list_size}</p>";

    // 5. Launch Offer Form
    } elseif ($formType == 'launch_offer_audit') {
        $subject = "Coach Lead: Launch Audit (From Offer Section)";
        $name = htmlspecialchars($_POST['user_name']);
        $email = htmlspecialchars($_POST['user_email']);
        $url = htmlspecialchars($_POST['user_url']);
        $platform = htmlspecialchars($_POST['user_platform']);
        
        $body = "<h2>Coach Launch Audit Request (Offer Section)</h2>
                 <p><strong>Name:</strong> {$name}</p>
                 <p><strong>Email:</strong> {$email}</p>
                 <p><strong>Website URL:</strong> {$url}</p>
                 <p><strong>Platform:</strong> {$platform}</p>";
                 
    } else {
        // If the form type doesn't match any of the above
        die("Invalid form submission.");
    }

    // =========================================================
    // PHPMailer Setup & Sending
    // =========================================================
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();                                            
        $mail->Host       = 'byteroc.com';                 
        $mail->SMTPAuth   = true;                          
        $mail->Username   = 'work@byteroc.com';            
        $mail->Password   = 'djwo nyff gvwr dxrz';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;   
        $mail->Port       = 465;                           

        $mail->setFrom('work@byteroc.com', 'Byteroc Website'); 
        $mail->addAddress('work@byteroc.com');                 
        
        if (isset($_POST['user_email']) && isset($_POST['user_name'])) {
            $mail->addReplyTo($_POST['user_email'], $_POST['user_name']);
        }

        $mail->isHTML(true);                                  
        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        
        header("Location: thank-you.html");
        exit();

    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo "Access denied. You must submit the form.";
}
?>