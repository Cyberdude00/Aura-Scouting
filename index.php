<?php
  // Start a session to display messages
  session_start();
  // Include the configuration file
  require_once 'config.php';
  // --- Message Handling ---
  $message = '';
  $messageType = '';

  // Check for success or error messages from send_email.php
  if (isset($_SESSION['success_message'])) {
    $message = $_SESSION['success_message'];
    $messageType = 'success';
    unset($_SESSION['success_message']); // Clear the message after displaying
  } elseif (isset($_SESSION['error_message'])) {
    $message = $_SESSION['error_message'];
    $messageType = 'error';
    unset($_SESSION['error_message']); // Clear the message after displaying
  }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Charset & Responsive -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Title & SEO -->
    <title>Aura Scouting | International Scouting Model Agency</title>
    <meta name="description"
    content="Aura Scouting is a modeling agency offering a scouting to connect agencies and promote talent from around the world. We connect Asia, America, and Europe." />
    <meta name="keywords"
    content="modeling agency, model scouting, international models, model promotion, talent agency" />
    <meta name="robots" content="index, follow" />
    <!-- Canonical URL -->
    <link rel="canonical" href="https://www.aurascouting.com/" />
        <!-- Language for search engines -->
        <meta name="language" content="en" />
    <meta name="renderer" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <!-- Meta Verifications -->
    <meta name="google-site-verification" content="uNugEzyCV6dv_8FfAjxyGEDG00xmW9EOHM565Vxfpyk" />
    <meta name="naver-site-verification" content="69a69ec196155004557c51f983ffef70b5d864ec" />
    <meta name="baidu-site-verification" content="dQ8vW9gIHq" />
    <meta name="wechat-site-verification" content="d7c8e7bd89ed99ab7cd4e1f5ff14b9d0" />
    <meta name="seznam-site-verification" content="v7b9-82hg-jf9i-82dh-93yg-81db-x95w" />

    <!-- Open Graph (Facebook, LinkedIn) -->
  <meta property="og:title" content="Aura Scouting | International Model Agency" />
    <meta property="og:description"
        content="Aura Scouting is a modeling agency offering a global platform to connect and promote talent from around the world. We connect models and agencies internationally." />
    <meta name="twitter:image" content="https://www.aurascouting.com/favicon/mini-logo.png">
    <meta property="og:url" content="https://www.aurascouting.com/" />
    <meta property="og:type" content="website" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Aura Scouting | International Model Agency" />
    <meta name="twitter:description" content="Aura Scouting connects models and agencies globally." />
    <meta name="twitter:image" content="https://www.aurascouting.com/favicon/mini-logo.png">
    <meta name="twitter:url" content="https://www.aurascouting.com/" />

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Aura Scouting",
      "url": "https://www.aurascouting.com",
      "logo": "https://www.aurascouting.com/favicon/mini-logo.png",
      "sameAs": ["https://www.instagram.com/aurascouting"]
      ]
    }
    </script>
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon/favicon-196x196.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon/favicon-512x512.png">
    <link rel="shortcut icon" href="/favicon/favicon.ico" type="image/x-icon">
    <!-- Manifest (PWA support) -->
    <link rel="manifest" href="/favicon/manifest.json">
    <!-- Meta para Apple Web App -->
    <meta name="theme-color" content="#000000"> <!-- Meta color de tema para dispositivos móviles -->
    <meta name="theme-color" content="#000000">
    <!-- Fonts (local first, fallback Google Fonts) -->
    <link rel="preload" href="./font/IBMPlexMono-ExtraLight.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="./font/IBMPlexMono.css" />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@200&display=swap" rel="stylesheet" />

    <link rel="stylesheet" href="./public/css/index.css">
    <!-- Preload Key Images -->
    <link rel="preload" as="image" href="./public/images/aura-scouting-logo.png">
    <link rel="preload" as="image" href="./public/images/aura-scouting-europa.webp">
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-TZFR0FFT5D"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-TZFR0FFT5D');
    </script>
    <!-- Yandex Metrika -->
    <script type="text/javascript">
        (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () {
                (m[i].a = m[i].a || []).push(arguments)
            };
            m[i].l = 1 * new Date();
            for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) return;
            }
            k = e.createElement(t), a = e.getElementsByTagName(t)[0];
            k.async = 1;
            k.src = r;
            a.parentNode.insertBefore(k, a);
        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(102400484, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
        });
    </script>
    <noscript>
        <div><img src="https://mc.yandex.ru/watch/102400484" style="position:absolute; left:-9999px;" alt="" /></div>
    </noscript>
</head>
<body>
    <!-- Navigation -->
    <nav>
      <ul>
        <li><a href="#about">Who we are</a></li>
        <li><a href="#services">Our services</a></li>
        <li><a href="#model-submission">Model Submission</a></li>
        <li><a href="#contact">Contact us</a></li>
      </ul>
    </nav>

    <!-- Our name section -->
    <section id="our-name">
      <img src="./public/images/aura-scouting-logo.png" alt="Aura Scouting Logo" id="our-name-logo" loading="eager">
      <h1 id="our-name-text">
        We offer models and agencies the opportunity to shine<br>on the global stage.
      </h1>
    </section>

    <!-- About section -->
    <section id="about">
      <div class="big">
        <div class="small">
          <h2>Who we are</h2>
        </div>
        <div class="small">
          <h3>• As a global scouting agency, we specialize in discovering and promoting talent from diverse
            backgrounds, celebrating each individual’s unique beauty.</h3>
          <h3>• We provide structured access to global opportunities, acting as intermediaries between agencies to
            secure top-tier placements.</h3>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services">
      <div class="image-frame">
        <img src="./public/images/aura-scouting-asia.webp" alt="Scouting services in Asia" loading="lazy"
          class="services-image">
      </div>
      <div class="text-frame">
        <h2>Our scouting services</h2>
        <h3>• Connections with Agencies in America, Asia & Europe</h3>
        <h3>• Work Permit & Relocation Management</h3>
        <h3>• Scouting & Talent Development</h3>
        <h3>• Mentorship & Continuous Support</h3>
      </div>
    </section>

    <!-- How we work -->
    <section id="how">
      <div class="image-frame">
            <img src="./public/images/aura-scouting-mexico.jpg" alt="Scouting process in Mexico" loading="lazy"
          class="how-image">
      </div>
      <div class="text-frame">
        <h2>How we work</h2>
        <h3>• Scouting & Evaluation</h3>
        <h3>• Placement & Negotiation</h3>
        <h3>• Document Assistance</h3>
        <h3>• Comprehensive Support</h3>
        <h3>• Performance Monitoring</h3>
        <h3>• Payment Review</h3>
      </div>
    </section>

    <!-- Why choose us -->
    <section id="why">
      <div class="frame">
        <h2>Connect with Top Agencies</h2>
        <h3>• A strong network of agencies offering exclusive opportunities</h3>
        <h3>• A secure and transparent process from selection to contract</h3>
        <h3>• Comprehensive support before, during, and after each experience</h3>
        <h3>• Collaboration with mother agencies for long-term careers</h3>
      </div>
    </section>

    <!-- Model Submission Section -->
    <?php require_once './templates/form.php' ?>

    <!-- Contact Section -->
     <section id="contact">
      <h2>Contact Us</h2>
      <label>Get in touch with us for any inquiries or collaborations.</label>
      <h3>DIRECTORS</h3>
      <a href="mailto:emma@aurascouting.com">emma@aurascouting.com</a>
      <a href="mailto:magali@aurascouting.com">magali@aurascouting.com</a>
      <h3>INQUIRIES</h3>
      <a href="mailto:info@aurascouting.com">info@aurascouting.com</a>
      <h3>Follow Us:</h3>
      <a href="https://instagram.com/aurascouting" target="_blank" rel="noopener">Instagram</a>
    </section>

    <!-- Cookie Banner -->
    <div id="cookieBanner" style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
           background:rgba(0,0,0,0.85);color:#fff;padding:16px 20px;border-radius:12px;
           z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.4);
           font-family:'IBM Plex Mono', monospace;font-size:14px;text-align:center;
           max-width:90%;backdrop-filter:blur(8px); display:none;">
        <p style="margin:0;line-height:1.5;">
            We use cookies to improve your experience. By using our site, you agree to our
            <a href="/privacy-policy" style="color:#fff;text-decoration:underline;" target="_blank">Privacy Policy</a>.
        </p>
        <button id="cookieAcceptBtn" style="margin-top:12px;padding:8px 20px;border:none;border-radius:8px;
                background-color:#fff;color:#000;font-weight:600;font-size:14px;
                cursor:pointer;">OK</button>
    </div>

    <script>
        window.addEventListener('load', () => {
            if (!localStorage.getItem('cookieAccepted')) {
                document.getElementById('cookieBanner').style.display = 'block';
            }

            document.getElementById('cookieAcceptBtn').addEventListener('click', () => {
                localStorage.setItem('cookieAccepted', 'true');
                document.getElementById('cookieBanner').style.display = 'none';
            });
        });
    </script>

    <footer>
        &copy; 2025 Aura Scouting. All rights reserved.
        <p lang="zh" class="chinese-text">
            欢迎来到Aura Scouting。我们专注于发掘具有潜力的国际模特。
        </p>
    </footer>
</body>
</html>