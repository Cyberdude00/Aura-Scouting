<script>
  document.addEventListener('DOMContentLoaded', () = {
    // Desplazamiento suave para enlaces internos
    document.querySelectorAll('nav a[href^="#"], a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault(); // Evita el comportamiento predeterminado del enlace
          target.scrollIntoView({ behavior: 'smooth' }); // Desplazamiento suave
          history.pushState(null, null, targetId); // Actualiza la URL sin recargar
        }
      });
    })
  });
</script>
