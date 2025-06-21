<!-- Model Submission Section (new, with overlay) -->
<section id="model-submission">
  <link rel="stylesheet" href="./public/css/form.css">
  <script src="../public/js/form.js"> </script>
  <h2>Model Submission</h2>

  <div class="contact-form-wrapper">
    <?php if (!empty($message)): ?>
      <div class="message-box <?php echo $messageType; ?>">
        <?php echo htmlspecialchars($message); ?>
      </div>
    <?php endif; ?>

    <form id="emailForm" action="process/send_email.php" method="POST" enctype="multipart/form-data">
      <div class="picture-to-upload" id="pictureBox">
        <input id="image_attachment" class="file-input" type="file" name="image_attachment" accept="image/*" required>
        <img id="img-preview" class="img-preview" src="../public/images/aura-scouting-logo.png" alt="Preview" />
      </div>
      <p class="text-xs text-gray-500 mt-1">Max file size: <?= (MAX_UPLOAD_FILE_SIZE / (1024 * 1024)) ?>MB. Allowed types: JPG, PNG, GIF.</p>
      <input id="name" type="text" name="name" placeholder="Name*" class="text" required>
      <input id="email" type="email" name="email" placeholder="Email*" class="text" required>
      <input id="height" type="text" name="height" placeholder="Height*" class="text" required>
      <input id="cellphone" type="text" name="cellphone" placeholder="Cell Phone" class="text">
      <button type="submit" id="submitButton">SUBTMIT</button>
    </form>
  </div>
</section>
