/* ==========================================================
   AUREA | Comportamiento de la página
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMenu();
  initPaletteDemo();
  initPlanButtons();
  initContactForm();
  document.getElementById("anio").textContent = new Date().getFullYear();
});

/* ---------- Encabezado: borde y sombra al hacer scroll ---------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  const update = () =>
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------- Menú móvil ---------- */
function initMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu-principal");
  const label = toggle.querySelector(".sr-only");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    label.textContent = open ? "Cerrar menú" : "Abrir menú";
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Cierra el menú al elegir un enlace
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  // Cierra con Escape y devuelve el foco al botón
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------- Demo: cambiar la paleta del sitio de ejemplo ---------- */
function initPaletteDemo() {
  const demo = document.getElementById("demo-sitio");
  const status = document.getElementById("demo-estado");
  const buttons = document.querySelectorAll(".swatch");
  const names = { lino: "Lino", marfil: "Marfil", noche: "Noche" };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      demo.dataset.theme = theme;

      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      status.textContent = `Paleta ${names[theme]} aplicada al ejemplo.`;
    });
  });
}

/* ---------- Botones de plan: preseleccionan el plan en el formulario ---------- */
function initPlanButtons() {
  const select = document.getElementById("plan");

  document.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      select.value = link.dataset.plan;
    });
  });
}

/* ---------- Formulario de contacto ---------- */
function initContactForm() {
  const form = document.getElementById("form-contacto");
  const status = document.getElementById("form-estado");

  const fields = {
    nombre: {
      input: form.nombre,
      error: document.getElementById("error-nombre"),
      validate: (v) => (v.trim().length < 2 ? "Escribe tu nombre." : ""),
    },
    email: {
      input: form.email,
      error: document.getElementById("error-email"),
      validate: (v) => {
        if (!v.trim()) return "Escribe tu correo electrónico.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
          ? ""
          : "Revisa el correo: debe tener un formato como nombre@dominio.com.";
      },
    },
    mensaje: {
      input: form.mensaje,
      error: document.getElementById("error-mensaje"),
      validate: (v) =>
        v.trim().length < 10
          ? "Cuéntanos un poco más sobre tu proyecto (mínimo 10 caracteres)."
          : "",
    },
  };

  const check = (field) => {
    const message = field.validate(field.input.value);
    const wrapper = field.input.closest(".field");

    field.error.textContent = message;
    wrapper.classList.toggle("has-error", Boolean(message));
    field.input.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) {
      field.input.setAttribute("aria-describedby", field.error.id);
    } else {
      field.input.removeAttribute("aria-describedby");
    }
    return !message;
  };

  // Valida al salir de cada campo y corrige en vivo cuando ya hay error
  Object.values(fields).forEach((field) => {
    field.input.addEventListener("blur", () => check(field));
    field.input.addEventListener("input", () => {
      if (field.input.closest(".field").classList.contains("has-error"))
        check(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";

    const results = Object.values(fields).map(check);
    const firstInvalid = Object.values(fields).find((_, i) => !results[i]);

    if (firstInvalid) {
      firstInvalid.input.focus();
      return;
    }

    // Aquí se conectaría el envío real (correo, API o servicio de formularios).
    const name = fields.nombre.input.value.trim().split(" ")[0];
    status.textContent = `Gracias, ${name}. Recibimos tu solicitud y te escribiremos en un máximo de 48 horas.`;
    form.reset();
  });
}
