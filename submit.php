<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $score = $_POST['score'];
    echo "Your score submitted successfully! Score: " . $score;
}
?>