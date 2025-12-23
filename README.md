# Aca va el codigo terminado de la pagina de aura Scouting
# Primer parte c-va el SEO y la estructura Basica

---------------------
DECARGAR EL DRIVE CON TODA LA MEDIA
https://drive.google.com/drive/folders/1x3hRaXH6rcL-2SPK_zD_WntsJhXOb5Ah?usp=sharing
---------------------


-Ya esta listo en local, todo se ve correctamente

#ERRORES
Se empalma la X en pantallas pequeñas.
El text de directors puede ir en el footer y centrado

# MEJORAS
migrar a hangular
editar modelos desde front
verificar baidu

# Install instructions for php composer

# Run and ensure you got php 8.2>
php -v

# Only Linux version
  # Go one folder above the project example: root/Aura-Scouting and Run
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
  php -r "if (hash_file('sha384', 'composer-setup.php') === 'e21205b207c3ffce0319d82357afdc6f7db1f0ee510c7fd9b538890fffa75b9f078a51ae1bfd829116c88fa8f0354dd1') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
  php composer-setup.php

  php composer.phar install

  php -r "unlink('composer-setup.php');"

# Only windows
  # Download and Run composer-setup.exe from https://getcomposer.org/download/

# Verify instalation, Run

composer -v

# Install dependences
composer install

# Troubleshooting
- "Class 'PHPMailer\PHPMailer\PHPMailer' not found": This usually means composer install was not run, or the vendor/autoload.php file is not correctly included.

- SMTP Connection Errors: Double-check your SMTP_HOST, SMTP_PORT, SMTP_ENCRYPTION, SMTP_USERNAME, and SMTP_PASSWORD in config.php. Ensure your firewall isn't blocking outgoing connections on the specified port.

- Gmail Specific Issues: Make sure you're using an App password if 2FA is on, or that "Less secure app access" is enabled (though App passwords are more secure).

- Check PHP Error Logs: Your web server's PHP error logs can provide more detailed information about what went wrong.